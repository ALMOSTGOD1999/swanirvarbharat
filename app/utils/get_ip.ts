import type { HttpRequest } from '@adonisjs/core/http'

export const getIpAddress = (request: HttpRequest) => {
  const cfConnectingIp = request.header('Cf-Connecting-Ip')

  if (cfConnectingIp) return cfConnectingIp

  const xForwardedFor = request.header('X-Forwarded-For')

  if (xForwardedFor) return xForwardedFor.split(',').at(0)

  return request.ip()
}
