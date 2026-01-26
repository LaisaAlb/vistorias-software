import { EventEmitter } from 'node:events'

export type DomainEvents = {
  'inspection.created': { inspectionId: string; sellerId: string }
  'inspection.status_changed': {
    inspectionId: string
    sellerId: string
    status: 'APPROVED' | 'REJECTED'
  }
}

class Bus extends EventEmitter {
  emit<K extends keyof DomainEvents>(event: K, payload: DomainEvents[K]): boolean {
    return super.emit(event, payload)
  }
  on<K extends keyof DomainEvents>(event: K, listener: (payload: DomainEvents[K]) => void): this {
    return super.on(event, listener)
  }
}

export const bus = new Bus()
