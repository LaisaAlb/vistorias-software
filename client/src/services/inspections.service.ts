import { http } from "./http"
import type {
  Inspection,
  InspectionStatus,
  Paginated,
} from "../interfaces/inspection"

type ListParams = {
  page: number
  perPage: number
  status?: InspectionStatus | ""
  q?: string // <- NOVO: busca por placa OU cliente
}

type InspectionQuery = {
  page: number
  perPage: number
  status?: InspectionStatus
  q?: string
}

export async function listInspections(token: string, params: ListParams) {
  const query: InspectionQuery = {
    page: params.page,
    perPage: params.perPage,
  }

  if (params.status) {
    query.status = params.status as InspectionStatus
  }

  if (params.q?.trim()) {
    query.q = params.q.trim()
  }

  return http<Paginated<Inspection>>({
    method: "GET",
    path: "/inspections",
    token,
    query,
  })
}

export async function getInspectionById(token: string, id: string) {
  return http<Inspection>({
    method: "GET",
    path: `/inspections/${id}`,
    token,
  })
}

export async function createInspection(
  token: string,
  body: {
    customerName: string
    plate: string
    vehicleModel: string
    vehicleYear: number
    value: string
  }
) {
  return http<Inspection>({
    method: "POST",
    path: "/inspections",
    token,
    body,
  })
}

export async function changeInspectionStatus(
  token: string,
  id: string,
  body: {
    status: "APPROVED" | "REJECTED"
    rejectionReasonId?: string
    rejectionComment?: string
  }
) {
  return http<Inspection>({
    method: "PATCH",
    path: `/inspections/${id}/status`,
    token,
    body,
  })
}

export async function approveInspection(token: string, id: string) {
  return changeInspectionStatus(token, id, { status: "APPROVED" })
}

export async function rejectInspection(
  token: string,
  id: string,
  body: {
    rejectionReasonId: string
    rejectionComment?: string
  }
) {
  return changeInspectionStatus(token, id, {
    status: "REJECTED",
    rejectionReasonId: body.rejectionReasonId,
    rejectionComment: body.rejectionComment,
  })
}
