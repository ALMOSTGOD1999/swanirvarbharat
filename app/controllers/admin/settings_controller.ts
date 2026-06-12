import type { HttpContext } from '@adonisjs/core/http'
import configService from '#services/config_service'

export default class SettingsController {
  async index({ inertia, bouncer }: HttpContext) {
    await bouncer.with('RolePolicy').authorize('viewList')

    const aiConfigs = await configService.getByGroup('ai')

    return inertia.render('admin/settings/index', {
      configs: aiConfigs.map((c) => ({
        id: c.id,
        group: c.group,
        key: c.key,
        value: c.value,
        type: c.type,
        label: c.label,
        description: c.description,
      })),
    })
  }

  async update({ request, response, session, bouncer }: HttpContext) {
    await bouncer.with('RolePolicy').authorize('update')

    const data = request.only(['provider', 'api_key', 'base_url', 'model'])

    await configService.setMany('ai', [
      {
        key: 'provider',
        value: data.provider || 'openai',
        type: 'string',
        label: 'AI Provider',
        description: 'The AI provider to use (openai, anthropic, google)',
      },
      {
        key: 'api_key',
        value: data.api_key || '',
        type: 'string',
        label: 'API Key',
        description: 'API key for the selected provider',
      },
      {
        key: 'base_url',
        value: data.base_url || '',
        type: 'string',
        label: 'Base URL',
        description: 'Custom base URL (optional, for proxies or compatible APIs)',
      },
      {
        key: 'model',
        value: data.model || '',
        type: 'string',
        label: 'Model',
        description: 'Model name (optional, uses provider default if empty)',
      },
    ])

    session.flash('success', 'AI settings updated successfully.')
    return response.redirect().back()
  }
}
