import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import app from '@adonisjs/core/services/app'
import env from '#start/env'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import unzipper from 'unzipper'

const EDITIONS = [
  {
    destFilename: 'DB3.IPV4.BIN',
    code: 'DB3LITEBIN',
    binInZip: 'IP2LOCATION-LITE-DB3.BIN',
  },
  {
    destFilename: 'DB3.IPV6.BIN',
    code: 'DB3LITEBINIPV6',
    binInZip: 'IP2LOCATION-LITE-DB3.IPV6.BIN',
  },
]

export default class UpdateGeoLocation extends BaseCommand {
  static commandName = 'update:geoLocation'
  static description = 'Download and extract IP2Location BIN databases (IPv4 and IPv6)'

  static options: CommandOptions = {}

  async run() {
    const token = env.get('IP2_LOCATION_TOKEN')
    const destDir = app.publicPath('ip2location')

    await fs.promises.mkdir(destDir, { recursive: true })

    for (const edition of EDITIONS) {
      await this.downloadAndExtract(token, edition, destDir)
    }
  }

  private async downloadAndExtract(
    token: string,
    edition: (typeof EDITIONS)[number],
    destDir: string
  ) {
    const { code, binInZip, destFilename } = edition
    const url = `https://www.ip2location.com/download/?token=${token}&file=${code}`
    const dest = path.join(destDir, destFilename)
    const tmpZip = path.join(destDir, `${destFilename}.zip.tmp`)

    this.logger.info(`Downloading ${code}...`)

    const response = await fetch(url)

    if (!response.ok || !response.body) {
      this.logger.error(`Failed to download ${code}: HTTP ${response.status}`)
      return
    }

    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('text')) {
      const text = await response.text()
      this.logger.error(`Unexpected response for ${code}: ${text.trim()}`)
      return
    }

    // Save zip to a tmp file first
    try {
      await pipeline(
        response.body as unknown as NodeJS.ReadableStream,
        fs.createWriteStream(tmpZip)
      )
    } catch (err) {
      await fs.promises.rm(tmpZip, { force: true })
      throw err
    }

    this.logger.info(`Extracting ${binInZip}...`)

    // Extract the specific .BIN file from the zip
    const tmpBin = `${dest}.tmp`
    try {
      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(tmpZip)
          .pipe(unzipper.Parse())
          .on('entry', (entry: unzipper.Entry) => {
            if (entry.path === binInZip) {
              pipeline(entry, fs.createWriteStream(tmpBin)).then(resolve).catch(reject)
            } else {
              entry.autodrain()
            }
          })
          .on('error', reject)
      })

      await fs.promises.rename(tmpBin, dest)
      this.logger.success(`Saved ${destFilename}`)
    } finally {
      await fs.promises.rm(tmpZip, { force: true })
      await fs.promises.rm(tmpBin, { force: true }).catch(() => {})
    }
  }
}
