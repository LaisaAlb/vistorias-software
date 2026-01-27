import { useEffect, useMemo, useState } from "react"
import { ClipboardList, Clock } from "lucide-react"
import { toast } from "react-toastify"

import { StatsCard } from "../../components/StatsCard/startsCard"
import { SearchBar } from "../../components/SearchBar/searchBar"
import { InspectionsTable } from "../../components/InspectionsTable/inspectionsTable"
import { Pagination } from "../../components/Pagination/pagination"
import { NewInspectionModal } from "../../components/Modals/newInspectionModal"
import { RejectInspectionModal } from "../../components/Modals/rejectInspectionModal"

import { useAuth } from "../../contexts/AuthContext"
import type { Inspection, InspectionStatus } from "../../interfaces/inspection"
import type { RejectionReason } from "../../interfaces/RejectionReason "

import {
  changeInspectionStatus,
  createInspection,
  listInspections,
} from "../../services/inspections.service"
import { listRejectionReasons } from "../../services/rejectionReasons.service"

export default function InspectionsList() {
  const { token, user } = useAuth()

  const isInspector = user?.role === "INSPECTOR"
  const isSeller = user?.role === "SELLER"

  const [items, setItems] = useState<Inspection[]>([])
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<InspectionStatus | "">("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [newOpen, setNewOpen] = useState(false)

  const [rejectOpen, setRejectOpen] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(
    null
  )

  const [rejectionReasons, setRejectionReasons] = useState<RejectionReason[]>([])

  async function fetchList() {
    if (!token) return
    setLoading(true)
    setError(null)

    try {
      const data = await listInspections(token, {
        page,
        perPage,
        status: status || undefined,
        q: search || undefined, 
      })

      setItems(data.items)
      setTotalPages(data.meta.totalPages || 1)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha ao carregar vistorias"
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, perPage, status, search])

  useEffect(() => {
    async function loadReasons() {
      if (!token || !isInspector) return
      try {
        const data = await listRejectionReasons(token)
        setRejectionReasons(data)
      } catch {
        setRejectionReasons([])
        toast.warning("Não foi possível carregar os motivos de reprovação")
      }
    }
    loadReasons()
  }, [token, isInspector])

  const stats = useMemo(() => {
    const todayStr = new Date().toDateString()
    const today = items.filter(
      (i) => new Date(i.createdAt).toDateString() === todayStr
    ).length

    const pending = items.filter((i) => i.status === "PENDING").length
    return { today, pending }
  }, [items])

  async function handleApprove(id: string) {
    if (!token) return
    try {
      await changeInspectionStatus(token, id, { status: "APPROVED" })
      toast.success("Vistoria aprovada com sucesso!")
      await fetchList()
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha ao aprovar vistoria"
      setError(msg)
      toast.error(msg)
    }
  }

  function handleReject(id: string) {
    const found = items.find((i) => i.id === id) || null
    setSelectedInspection(found)
    setRejectOpen(true)
  }

  async function submitReject(data: { reasonId: string; comment?: string }) {
    if (!token || !selectedInspection) return

    try {
      await changeInspectionStatus(token, selectedInspection.id, {
        status: "REJECTED",
        rejectionReasonId: data.reasonId,
        rejectionComment: data.comment,
      })

      toast.info("Vistoria reprovada")
      setRejectOpen(false)
      setSelectedInspection(null)
      await fetchList()
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha ao reprovar vistoria"
      toast.error(msg)
      throw e
    }
  }

  async function submitNewInspection(data: {
    customerName: string
    plate: string
    vehicleModel: string
    vehicleYear: number
    value: string
  }) {
    if (!token) return
    try {
      await createInspection(token, data)
      toast.success("Vistoria criada com sucesso!")
      setNewOpen(false)
      await fetchList()
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha ao criar vistoria"
      setError(msg)
      toast.error(msg)
    }
  }

  function handleSendConfirmation() {
    toast.success("Confirmação enviada ao cliente ✅")
  }

  function exportCsv() {
    try {
      if (!items.length) {
        toast.info("Não há vistorias para exportar")
        return
      }

      const header = [
        "Nome do Cliente",
        "Placa",
        "Modelo",
        "Data de Criação",
        "Status",
        "Motivo da Reprovação",
      ]

      const rows = items.map((i) => [
        i.customerName,
        i.plate,
        i.vehicleModel,
        i.createdAt,
        i.status,
        i.rejectionReason?.title ?? "",
      ])

      const csv = [header, ...rows]
        .map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
        .join("\n")

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "vistorias.csv"
      a.click()
      URL.revokeObjectURL(url)

      toast.success("CSV exportado com sucesso!")
    } catch {
      toast.error("Falha ao exportar CSV")
    }
  }

  return (
    <div className="w-full p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard title="Vistorias Hoje" value={stats.today} icon={ClipboardList} />
        <StatsCard
          title="Aguardando Análise"
          value={stats.pending}
          variant="warning"
          icon={Clock}
        />
      </div>

      <SearchBar
        search={search}
        onSearchChange={(v) => {
          setPage(1)
          setSearch(v)
        }}
        status={status}
        onStatusChange={(v) => {
          setPage(1)
          setStatus(v)
        }}
        onExport={exportCsv}
        isSeller={!!isSeller}
        onNewInspection={() => setNewOpen(true)}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border rounded-lg p-8 text-center text-gray-500">
          Carregando vistorias...
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <InspectionsTable
            items={items}
            isInspector={!!isInspector}
            onApprove={handleApprove}
            onReject={handleReject}
            onSendConfirmation={handleSendConfirmation}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      )}

      <NewInspectionModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onSubmit={submitNewInspection}
      />

      <RejectInspectionModal
        open={rejectOpen}
        onClose={() => {
          setRejectOpen(false)
          setSelectedInspection(null)
        }}
        inspection={selectedInspection}
        reasons={rejectionReasons}
        onSubmit={submitReject}
      />
    </div>
  )
}
