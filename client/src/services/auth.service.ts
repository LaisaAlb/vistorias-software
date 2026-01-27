import { http } from './http'
import type { LoginResponse } from '../interfaces/auth'

type LoginBody = {
  email: string
  password: string
}

export async function loginService(body: LoginBody) {
  return http<LoginResponse, LoginBody>({
    method: 'POST',
    path: '/auth/login',
    body,
  })
}

