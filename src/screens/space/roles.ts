const roles = {
  Founders:
    'Founders can see content in the space and book calls with mentors.',
  Mentors: 'Founders can see content in the space and book calls with mentors.',
  Owners: 'Owners can manage this space and invite new members.',
} as const

export default roles
export type Role = keyof typeof roles
