import { UAParser } from 'ua-parser-js'

export const getUserAgent = (ua?: string) => {
  if (!ua) return undefined
  return UAParser(ua)
}
