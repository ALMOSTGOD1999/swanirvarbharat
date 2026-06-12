import { BasePolicy } from '@adonisjs/bouncer'
import type User from '#models/user'
import { Roles, RoleWeights } from '#enums/roles'

export default class AppBasePolicy extends BasePolicy {
  protected isAdmin(user: User): boolean {
    return user.roleId === Roles.ADMIN
  }

  protected isContributorLvl2(user: User): boolean {
    return user.roleId === Roles.CONTRIBUTOR_LVL_2
  }

  protected isContributorLvl1(user: User): boolean {
    return user.roleId === Roles.CONTRIBUTOR_LVL_1
  }

  protected isContributor(user: User): boolean {
    return [Roles.CONTRIBUTOR_LVL_1, Roles.CONTRIBUTOR_LVL_2].includes(user.roleId as any)
  }

  protected isAtLeast(user: User, role: (typeof Roles)[keyof typeof Roles]): boolean {
    const userIdx = RoleWeights.indexOf(user.roleId as any)
    const requiredIdx = RoleWeights.indexOf(role)
    return userIdx >= requiredIdx
  }

  protected isOwner(
    user: User,
    resource: { ownerId?: string | null; userId?: string | null }
  ): boolean {
    return user.id === resource.ownerId || user.id === resource.userId
  }
}
