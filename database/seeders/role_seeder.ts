import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Roles } from '#enums/roles'
import Role from '#models/role'

export default class RoleSeeder extends BaseSeeder {
  async run() {
    await Role.updateOrCreateMany('id', [
      { id: Roles.USER, name: 'User', description: 'Authenticated User' },
      { id: Roles.ADMIN, name: 'Admin', description: 'Super User' },
      {
        id: Roles.CONTRIBUTOR_LVL_1,
        name: 'Contributor LVL 1',
        description: 'Can contribute content',
      },
      {
        id: Roles.CONTRIBUTOR_LVL_2,
        name: 'Contributor LVL 2',
        description: 'Can contribute content, series, and taxonomies',
      },
    ])
  }
}
