export type Role = 'SELLER' | 'INSPECTOR'

export type User = {
  id: string
  name: string
  email: string
  role: Role
}

export type LoginResponse = {
  token: string
  user: User
}
