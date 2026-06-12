export const CaptionTypes = {
  SRT: 'SRT',
  VTT: 'VTT',
}

export type CaptionType = (typeof CaptionTypes)[keyof typeof CaptionTypes]
