import app from '@adonisjs/core/services/app'
import { IP2Location } from 'ip2location-nodejs'

export const getLocation = (ip?: string) => {
  const fallback = { city: undefined, countryLong: undefined, countryShort: undefined }
  if (app.inTest || !ip) return fallback

  try {
    const ip2Location = new IP2Location()
    const version = ip.includes(':') ? 'IPV6' : 'IPV4'
    const bin = app.publicPath(`ip2location/DB3.${version}.BIN`)

    ip2Location.open(bin)

    const data = ip2Location.getAll(ip)

    ip2Location.close()

    return data
  } catch (error) {
    // TODO Setup a logger system for Slack or Discord
    // await logger.error('IdentityService.getLocation', error.message)
    return fallback
  }
}
