import { http } from './http'
import type { RejectionReason } from '../interfaces/RejectionReason ' 

export async function listRejectionReasons(token: string) {
  return http<RejectionReason[]>({
    method: 'GET',
    path: '/rejection-reasons',
    token,
  })
}
