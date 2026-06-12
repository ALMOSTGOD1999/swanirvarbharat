export const AssetTypes = {
  THUMBNAIL: 'THUMBNAIL',
  COVER: 'COVER',
  ADVERTISEMENT: 'ADVERTISEMENT',
}

export type AssetType = (typeof AssetTypes)[keyof typeof AssetTypes]
