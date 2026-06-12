import { compose } from '@adonisjs/core/helpers'
import { column } from '@adonisjs/lucid/orm'

import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

import { AuthAttemptSchema } from '#database/schema'
import { withID } from '#utils/with_id_mixin'
import { DateTime } from 'luxon'
import { type AuthAttemptPurpose, AuthAttemptPurposes } from '#enums/auth'

export default class AuthAttempt extends compose(AuthAttemptSchema, withID) {
  protected static allowedAttempts = 3

  @column()
  declare purpose: AuthAttemptPurpose

  // Attempts
  static async allows(uid: string) {
    return this.hasAttempts(uid)
  }

  static async disallows(uid: string) {
    return !(await this.hasAttempts(uid))
  }

  static async hasAttempts(uid: string) {
    const remaining = await this.remainingAttempts(uid)
    return remaining >= 0
  }

  static async remainingAttempts(uid: string) {
    const attempts = await this.badAttempts(uid)
    return this.allowedAttempts - attempts
  }

  static async badAttempts(uid: string): Promise<number> {
    const attempts = await AuthAttempt.query()
      .where({ uid })
      .whereNull('deletedAt')
      .count('id')
      .first()

    return Number.parseInt(attempts?.$extras.count ?? 0)
  }

  // Actions
  static async clear(uid: string, trx?: TransactionClientContract) {
    await AuthAttempt.query({ client: trx })
      .where({ uid })
      .whereNull('deletedAt')
      .update({ deletedAt: DateTime.now() })
  }

  static async recordBadLogin(uid: string) {
    return AuthAttempt.create({
      uid,
      purpose: AuthAttemptPurposes.LOGIN,
    })
  }

  static async recordBadEmailChange(uid: string) {
    return AuthAttempt.create({
      uid,
      purpose: AuthAttemptPurposes.CHANGE_EMAIL,
    })
  }
}
