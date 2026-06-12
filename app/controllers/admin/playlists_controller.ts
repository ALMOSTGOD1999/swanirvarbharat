import type { HttpContext } from '@adonisjs/core/http'
import {
  playlistIndexValidator,
  createPlaylistValidator,
  updatePlaylistValidator,
  playlistPostValidator,
  reorderPlaylistPostsValidator,
} from '#validators/playlist'
import Playlist from '#models/playlist'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import PlaylistTransformer from '#transformers/playlist_transformer'
import ThumbnailService from '#services/thumbnail_service'
import { cuid } from '#utils/id'

const ALLOWED_SORT_COLUMNS = ['name', 'createdAt', 'updatedAt'] as const
const DEFAULT_SORT_COLUMN = 'createdAt'
const DEFAULT_SORT_ORDER = 'desc' as const

export default class PlaylistsController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('PlaylistPolicy').authorize('viewList')
    const {
      page = 1,
      limit = 10,
      q = '',
      states = [],
      ownerIds = [],
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
    } = await playlistIndexValidator.validate(request.qs())

    const playlistsQuery = Playlist.query()

    if (q) {
      playlistsQuery.whereILike('name', `%${q}%`)
    }

    if (states.length > 0) {
      playlistsQuery.whereIn('state', states)
    }

    if (ownerIds.length > 0) {
      playlistsQuery.whereIn('ownerId', ownerIds)
    }

    if (dateFrom) {
      playlistsQuery.where('createdAt', '>=', dateFrom)
    }

    if (dateTo) {
      playlistsQuery.where('createdAt', '<=', dateTo)
    }

    const sortColumn = ALLOWED_SORT_COLUMNS.includes(sortBy as any) ? sortBy! : DEFAULT_SORT_COLUMN
    const sortDirection = sortOrder ?? DEFAULT_SORT_ORDER

    const paginatedPlaylists = await playlistsQuery
      .preload('owner')
      .preload('asset')
      .withCount('posts')
      .orderBy(sortColumn, sortDirection)
      .paginate(page, limit)

    paginatedPlaylists.queryString(request.qs())

    const allOwners = await User.query()
      .select(['id', 'username', 'email'])
      .preload('profile')
      .orderBy('username')

    return inertia.render('admin/playlists/index', {
      playlists: PlaylistTransformer.paginate(
        paginatedPlaylists.all(),
        paginatedPlaylists.getMeta()
      ),
      q,
      states,
      ownerIds,
      dateFrom: dateFrom ?? '',
      dateTo: dateTo ?? '',
      sortBy: sortBy ?? 'createdAt',
      sortOrder: sortOrder ?? 'desc',
      allOwners: allOwners.map((u) => ({
        id: u.id,
        name: u.profile?.name || u.username || u.email,
      })),
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with('PlaylistPolicy').authorize('create')

    return inertia.render('admin/playlists/form', {})
  }

  async store({ auth, request, response, session, bouncer }: HttpContext) {
    await bouncer.with('PlaylistPolicy').authorize('create')
    const { thumbnail, ...payload } = await request.validateUsing(createPlaylistValidator)
    const user = auth.getUserOrFail()

    const trx = await db.transaction()

    try {
      const playlist = await Playlist.create(
        {
          ...payload,
          ownerId: user.id,
          description: payload.description ?? '',
        },
        { client: trx }
      )

      await ThumbnailService.handleCreate(playlist, thumbnail, 'asset', trx)

      await trx.commit()

      session.flash('success', 'Playlist created successfully.')
      return response.redirect().toRoute('admin.playlists.edit', { id: playlist.id })
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Some error occurred. Your playlist was not created.')
      throw error
    }
  }

  async edit({ params, serialize, inertia, bouncer }: HttpContext) {
    const playlist = await Playlist.query()
      .where('id', params.id)
      .orWhere('slug', params.id)
      .preload('asset')
      .firstOrFail()
    await bouncer.with('PlaylistPolicy').authorize('update', playlist)

    const p = await serialize(PlaylistTransformer.transform(playlist))

    return inertia.render('admin/playlists/form', {
      playlist: p.data,
    })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    const { thumbnail, ...payload } = await request.validateUsing(updatePlaylistValidator)

    const playlist = await Playlist.query().where('id', params.id).preload('asset').firstOrFail()
    await bouncer.with('PlaylistPolicy').authorize('update', playlist)

    const trx = await db.transaction()

    try {
      playlist.useTransaction(trx)
      playlist.merge({
        ...payload,
        description: payload.description ?? playlist.description,
      })
      await playlist.save()

      await ThumbnailService.handleUpdate(playlist, thumbnail, 'asset', trx)

      await trx.commit()

      session.flash('success', 'Playlist updated successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to update playlist.')
      throw error
    }
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    const playlist = await Playlist.query().where('id', params.id).firstOrFail()
    await bouncer.with('PlaylistPolicy').authorize('delete', playlist)

    const trx = await db.transaction()

    try {
      // Delete playlist_posts pivot records
      await trx.from('playlist_posts').where('playlist_id', playlist.id).delete()

      // Delete the playlist itself
      await Playlist.query({ client: trx }).where('id', playlist.id).delete()

      await trx.commit()

      session.flash('success', 'Playlist deleted successfully.')
      return response.redirect().toRoute('admin.playlists.index')
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to delete playlist.')
      throw error
    }
  }

  // --- Post management ---

  async storePost({ params, request, response, session, bouncer }: HttpContext) {
    const playlist = await Playlist.query().where('id', params.id).firstOrFail()
    await bouncer.with('PlaylistPolicy').authorize('update', playlist)

    const data = await request.validateUsing(playlistPostValidator)

    const trx = await db.transaction()

    try {
      // Get the next sort order
      const lastPost = await db
        .from('playlist_posts')
        .where('playlist_id', playlist.id)
        .orderBy('sort_order', 'desc')
        .first()

      const baseSortOrder = (lastPost?.sort_order ?? -1) + 1

      if (data.postIds && data.postIds.length > 0) {
        for (let i = 0; i < data.postIds.length; i++) {
          await trx.table('playlist_posts').insert({
            id: cuid(24),
            playlist_id: playlist.id,
            post_id: data.postIds[i],
            sort_order: baseSortOrder + i,
          })
        }
      }

      await trx.commit()

      session.flash('success', 'Post(s) added to playlist successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to add post(s) to playlist.')
      throw error
    }
  }

  async reorderPosts({ params, request, response, session, bouncer }: HttpContext) {
    const playlist = await Playlist.query().where('id', params.id).firstOrFail()
    await bouncer.with('PlaylistPolicy').authorize('update', playlist)

    const { postIds } = await request.validateUsing(reorderPlaylistPostsValidator)

    const trx = await db.transaction()

    try {
      for (let i = 0; i < postIds.length; i++) {
        await trx
          .from('playlist_posts')
          .where('playlist_id', playlist.id)
          .where('post_id', postIds[i])
          .update({ sort_order: i })
      }

      await trx.commit()

      session.flash('success', 'Post order updated successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to update post order.')
      throw error
    }
  }

  async destroyPost({ params, response, session, bouncer }: HttpContext) {
    const playlist = await Playlist.query().where('id', params.playlistId).firstOrFail()
    await bouncer.with('PlaylistPolicy').authorize('update', playlist)

    const trx = await db.transaction()

    try {
      await trx
        .from('playlist_posts')
        .where('playlist_id', params.playlistId)
        .where('post_id', params.postId)
        .delete()

      await trx.commit()

      session.flash('success', 'Post removed from playlist successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to remove post from playlist.')
      throw error
    }
  }
}
