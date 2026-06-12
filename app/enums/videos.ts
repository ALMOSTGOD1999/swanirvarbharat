export const VideoTypes = {
  YOUTUBE: 'YouTube',
  BUNNY: 'Bunny',
  NONE: 'None',
  S3: 'S3',
  DRIVE: 'Drive',
  OTHER: 'Other',
}

export type VideoType = (typeof VideoTypes)[keyof typeof VideoTypes]
