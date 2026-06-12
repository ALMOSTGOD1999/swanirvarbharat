import { attachmentManager } from '@jrmc/adonis-attachment'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import type Asset from '#models/asset'
import AssetModel from '#models/asset'
import { cuid } from '#utils/id'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

type ThumbnailData = {
  file?: MultipartFile | 'remove' | string | undefined | null
  assetId?: string | null
  altText?: string
  credit?: string
}

/**
 * Shared thumbnail handling for posts (manyToMany) and series/taxonomies (belongsTo).
 * Handles create, update (replace/remove/metadata-only), and store operations.
 */
export default class ThumbnailService {
  /**
   * Get the current thumbnail asset from a model.
   * - belongsTo (series/taxonomies): returns model.asset (single Asset | undefined)
   * - manyToMany (posts): returns model.thumbnails[0] (first Asset | undefined)
   */
  private static getExistingThumbnail(model: any, relation: string): Asset | undefined {
    if (relation === 'thumbnails') {
      const thumbnails = model.thumbnails
      return thumbnails?.length ? thumbnails[0] : undefined
    }
    return model.asset
  }

  /**
   * Handle thumbnail during create (store).
   * Creates the asset record linked to the parent model.
   */
  static async handleCreate(
    model: any,
    thumbnail: ThumbnailData | undefined,
    relation: string,
    trx?: TransactionClientContract
  ) {
    // If an existing asset ID is provided, attach it instead of creating new
    if (thumbnail?.assetId) {
      await this.handleAttachExisting(model, thumbnail.assetId, thumbnail, relation, trx)
      return
    }

    if (!thumbnail?.file || typeof thumbnail.file !== 'object' || !('size' in thumbnail.file)) {
      return
    }

    const uploadedFile = await attachmentManager.createFromFile(thumbnail.file)

    if (relation === 'thumbnails') {
      // manyToMany (posts): create Asset first, then attach with pivot ID
      // related().create() doesn't generate pivot IDs for relations with onQuery filters
      const asset = await AssetModel.create(
        {
          asset: uploadedFile,
          altText: thumbnail.altText ?? '',
          credit: thumbnail.credit ?? '',
        },
        trx ? { client: trx } : undefined
      )
      await model
        .related('assets')
        .attach({ [asset.id]: { id: cuid(24), sort_order: 0 } }, trx ? { client: trx } : undefined)
    } else {
      // belongsTo (series/taxonomies): create via relation directly
      await model.related(relation).create(
        {
          asset: uploadedFile,
          altText: thumbnail.altText ?? '',
          credit: thumbnail.credit ?? '',
        },
        trx ? { client: trx } : undefined
      )
    }
  }

  /**
   * Handle thumbnail during update.
   * Supports three actions: 'remove', replace (file object), attach existing (assetId), or metadata-only update.
   */
  static async handleUpdate(
    model: any,
    thumbnail: ThumbnailData | undefined,
    relation: string,
    trx?: TransactionClientContract
  ) {
    if (!thumbnail) return

    const thumbnailAction = thumbnail.file
    const existing = this.getExistingThumbnail(model, relation)

    // If an existing asset ID is provided, attach it (replacing current thumbnail)
    if (thumbnail.assetId) {
      // Remove current thumbnail first
      if (existing) {
        if (relation === 'thumbnails') {
          await model.related('assets').detach([existing.id])
        } else {
          // belongsTo: set FK to null
          model.assetId = null
          await model.save()
        }
        await existing.delete()
        await attachmentManager.remove(existing.asset)
      }
      await this.handleAttachExisting(model, thumbnail.assetId, thumbnail, relation, trx)
      return
    }

    if (thumbnailAction === 'remove') {
      // Remove existing thumbnail
      if (existing) {
        // Detach pivot first, then delete asset record — both within transaction
        if (relation === 'thumbnails') {
          // Use unfiltered 'assets' relation for detach — 'thumbnails' has onQuery
          // filter on assets.type which doesn't exist on the pivot table
          await model.related('assets').detach([existing.id])
        }
        await existing.delete()
        // Remove S3 file after DB cleanup succeeds
        await attachmentManager.remove(existing.asset)
      }
    } else if (
      thumbnailAction &&
      typeof thumbnailAction === 'object' &&
      'size' in thumbnailAction
    ) {
      // New file uploaded — replace existing or create new
      if (existing) {
        await attachmentManager.remove(existing.asset)
        const uploadedFile = await attachmentManager.createFromFile(thumbnailAction)
        existing.asset = uploadedFile
        existing.altText = thumbnail.altText ?? ''
        existing.credit = thumbnail.credit ?? ''
        await existing.save()
      } else {
        const uploadedFile = await attachmentManager.createFromFile(thumbnailAction)
        if (relation === 'thumbnails') {
          // manyToMany: create Asset then attach with pivot ID
          const asset = await AssetModel.create({
            asset: uploadedFile,
            altText: thumbnail.altText ?? '',
            credit: thumbnail.credit ?? '',
          })
          await model.related('assets').attach({ [asset.id]: { id: cuid(24), sort_order: 0 } })
        } else {
          await model.related(relation).create({
            asset: uploadedFile,
            altText: thumbnail.altText ?? '',
            credit: thumbnail.credit ?? '',
          })
        }
      }
    } else {
      // No file change — just update altText/credit if provided
      if (existing) {
        existing.altText = thumbnail.altText ?? existing.altText
        existing.credit = thumbnail.credit ?? existing.credit
        await existing.save()
      }
    }
  }

  /**
   * Attach an existing asset to a model by asset ID.
   * - manyToMany (posts): attach with pivot ID
   * - belongsTo (series/taxonomies): set assetId FK
   */
  private static async handleAttachExisting(
    model: any,
    assetId: string,
    thumbnail: ThumbnailData,
    relation: string,
    trx?: TransactionClientContract
  ) {
    const asset = await AssetModel.findOrFail(assetId)

    // Update altText/credit if provided
    if (thumbnail.altText !== undefined || thumbnail.credit !== undefined) {
      asset.altText = thumbnail.altText ?? asset.altText
      asset.credit = thumbnail.credit ?? asset.credit
      await asset.save()
    }

    if (relation === 'thumbnails') {
      // manyToMany (posts): attach with pivot ID
      await model
        .related('assets')
        .attach({ [asset.id]: { id: cuid(24), sort_order: 0 } }, trx ? { client: trx } : undefined)
    } else {
      // belongsTo (series/taxonomies): set FK
      model.assetId = asset.id
      await model.save()
    }
  }
}
