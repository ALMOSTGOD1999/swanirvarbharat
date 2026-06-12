export const Roles = {
  USER: 'user',
  ADMIN: 'admin',
  CONTRIBUTOR_LVL_1: 'contributor_lvl_1',
  CONTRIBUTOR_LVL_2: 'contributor_lvl_2',
}

export type Roles = (typeof Roles)[keyof typeof Roles]

export const RoleWeights = [
  Roles.USER,
  Roles.CONTRIBUTOR_LVL_1,
  Roles.CONTRIBUTOR_LVL_2,
  Roles.ADMIN,
]
