export type InspectionStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type Inspection = {
  id: string
  customerName: string
  plate: string
  vehicleModel: string
  vehicleYear: number
  value: string 
  status: InspectionStatus
  rejectionComment: string | null
  rejectionReasonId: string | null
  createdAt: string
  updatedAt: string
  sellerId: string
  rejectionReason?: { id: string; title: string } | null
}

export type Paginated<T> = {
  items: T[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}
