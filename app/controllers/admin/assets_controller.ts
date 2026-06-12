import type { HttpContext } from '@adonisjs/core/http'
import Asset from '#models/asset'
import AssetTransformer from '#transformers/asset_transformer'
import { attachmentManager } from '@jrmc/adonis-attachment'
import db from '@adonisjs/lucid/services/db'
import { AssetTypes, type AssetType } from '#enums/asset'
import { assetIndexValidator } from '#validators/asset'

export default class AssetsController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('AssetPolicy').authorize('viewList')

    const {
      page = 1,
      limit = 10,
      q = '',
      types = [],
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = await assetIndexValidator.validate(request.qs())

    const assetsQuery = Asset.query()

    if (types.length > 0) {
      assetsQuery.whereIn('type', types)
    }

    if (q) {
      assetsQuery.where((builder) => {
        builder.whereILike('altText', `%${q}%`).orWhereILike('credit', `%${q}%`)
      })
    }

    if (dateFrom) {
      assetsQuery.where('createdAt', '>=', dateFrom)
    }

    if (dateTo) {
      assetsQuery.where('createdAt', '<=', dateTo)
    }

    const ALLOWED_SORT_COLUMNS = ['type', 'altText', 'createdAt', 'updatedAt']
    const sortColumn = ALLOWED_SORT_COLUMNS.includes(sortBy) ? sortBy : 'createdAt'
    const sortDirection = sortOrder === 'asc' ? 'asc' : 'desc'
    assetsQuery.orderBy(sortColumn, sortDirection)

    const paginatedAssets = await assetsQuery.paginate(page, limit)

    return inertia.render('admin/assets/index', {
      assets: AssetTransformer.paginate(paginatedAssets.all(), paginatedAssets.getMeta()),
      q,
      types,
      dateFrom: dateFrom ?? '',
      dateTo: dateTo ?? '',
      sortBy: sortBy ?? 'createdAt',
      sortOrder: sortOrder ?? 'desc',
    })
  }

  async store({ request, response, session, bouncer }: HttpContext) {
    try {
      await bouncer.with('AssetPolicy').authorize('create')

      const file = request.file('file', {
        size: '10mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
      })

      if (!file || file.hasErrors) {
        session.flash(
          'error',
          'Invalid file. Please upload an image (jpg, png, webp, gif, svg) under 10MB.'
        )
        return response.redirect().back()
      }

      const uploadedFile = await attachmentManager.createFromFile(file)

      await Asset.create({
        asset: uploadedFile,
        type: (request.input('type') as AssetType) || AssetTypes.THUMBNAIL,
        altText: request.input('altText', ''),
        credit: request.input('credit', ''),
      })

      session.flash('success', 'Asset uploaded successfully.')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', 'Failed to upload asset.')
      return response.redirect().back()
    }
  }

  async apiIndex({ request, response, bouncer, serialize }: HttpContext) {
    await bouncer.with('AssetPolicy').authorize('viewList')

    const { q = '', types = [] } = await assetIndexValidator.validate(request.qs())

    const query = Asset.query()

    if (types.length > 0) {
      query.whereIn('type', types)
    }

    if (q) {
      query.where((builder) => {
        builder.whereILike('altText', `%${q}%`).orWhereILike('credit', `%${q}%`)
      })
    }

    query.orderBy('createdAt', 'desc').limit(100)

    const assets = await query
    const { data } = await serialize(AssetTransformer.transform(assets))

    return response.ok(data)
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    try {
      await bouncer.with('AssetPolicy').authorize('delete')

      const asset = await Asset.findOrFail(params.id)

      await db.transaction(async (trx) => {
        asset.useTransaction(trx)

        // Detach from taxonomies (set assetId to null)
        const taxonomies = await asset.related('taxonomies').query()
        for (const taxonomy of taxonomies) {
          taxonomy.assetId = null
          await taxonomy.save()
        }

        // Detach from posts (manyToMany pivot)
        await asset.related('posts').detach()

        // Delete the asset record (attachment system handles file cleanup)
        await asset.delete()
      })

      session.flash('success', 'Asset deleted successfully.')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', 'Failed to delete asset.')
      return response.redirect().back()
    }
  }
}
