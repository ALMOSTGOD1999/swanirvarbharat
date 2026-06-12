import AppConfig from '#models/app_config'
import encryption from '@adonisjs/core/services/encryption'

/**
 * Keys that contain sensitive data and should be encrypted
 */
const SENSITIVE_KEYS = new Set(['api_key', 'secret', 'password', 'token', 'access_key'])

class ConfigService {
  /**
   * Check if a key should be encrypted
   */
  private isSensitive(key: string): boolean {
    return SENSITIVE_KEYS.has(key)
  }

  /**
   * Get a config value by group and key (decrypts if sensitive)
   */
  async get(group: string, key: string): Promise<string | null> {
    const config = await AppConfig.query().where('group', group).where('key', key).first()

    if (!config?.value) return null

    // Decrypt sensitive values
    if (this.isSensitive(key)) {
      const decrypted = encryption.decrypt(config.value, 'config')
      return decrypted as string | null
    }

    return config.value
  }

  /**
   * Get a config value with a default fallback
   */
  async getOrDefault(group: string, key: string, defaultValue: string): Promise<string> {
    const value = await this.get(group, key)
    return value ?? defaultValue
  }

  /**
   * Get all configs for a group (decrypts sensitive values)
   */
  async getByGroup(group: string): Promise<AppConfig[]> {
    const configs = await AppConfig.query().where('group', group).orderBy('key')

    // Decrypt sensitive values in-place for display
    for (const config of configs) {
      if (config.value && this.isSensitive(config.key)) {
        const decrypted = encryption.decrypt(config.value, 'config')
        // Store decrypted value for display (not saved to DB)
        config.value = (decrypted as string) || ''
      }
    }

    return configs
  }

  /**
   * Get all configs grouped by group
   */
  async getAllGrouped(): Promise<Record<string, AppConfig[]>> {
    const configs = await AppConfig.query().orderBy('group').orderBy('key')
    const grouped: Record<string, AppConfig[]> = {}
    for (const config of configs) {
      if (!grouped[config.group]) {
        grouped[config.group] = []
      }
      grouped[config.group].push(config)
    }
    return grouped
  }

  /**
   * Set a config value (upsert, encrypts if sensitive)
   */
  async set(
    group: string,
    key: string,
    value: string,
    options?: { type?: string; label?: string; description?: string }
  ): Promise<AppConfig> {
    // Encrypt sensitive values before storing
    const storedValue =
      this.isSensitive(key) && value ? encryption.encrypt(value, { purpose: 'config' }) : value

    const existing = await AppConfig.query().where('group', group).where('key', key).first()

    if (existing) {
      existing.merge({ value: storedValue, ...options })
      await existing.save()
      return existing
    }

    return AppConfig.create({
      group,
      key,
      value: storedValue,
      type: options?.type ?? 'string',
      label: options?.label ?? null,
      description: options?.description ?? null,
    })
  }

  /**
   * Set multiple configs at once
   */
  async setMany(
    group: string,
    configs: Array<{
      key: string
      value: string
      type?: string
      label?: string
      description?: string
    }>
  ): Promise<void> {
    for (const config of configs) {
      await this.set(group, config.key, config.value, {
        type: config.type,
        label: config.label,
        description: config.description,
      })
    }
  }

  /**
   * Delete a config
   */
  async delete(group: string, key: string): Promise<void> {
    const config = await AppConfig.query().where('group', group).where('key', key).first()
    if (config) {
      await config.delete()
    }
  }
}

const configService = new ConfigService()
export default configService
