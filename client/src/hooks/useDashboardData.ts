import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import type { Inspection } from "../interfaces/inspection" 
import { listInspections } from "../services/inspections.service" 

type SellerRow = {
  sellerId: string
  total: number
  approved: number
  rejected: number
  efficacyPct: number
}

export function useDashboardData(token?: string | null) {
  const [items, setItems] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!token) return
      setLoading(true)
      setError(null)

      try {
        const data = await listInspections(token, { page: 1, perPage: 50 })
        setItems(data.items)

        if (!data.items?.length) {
          toast.info("Ainda não há vistorias para exibir no dashboard")
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Falha ao carregar dashboard"
        setError(msg)
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [token])

  const metrics = useMemo(() => {
    const total = items.length
    const approved = items.filter((i) => i.status === "APPROVED").length
    const pending = items.filter((i) => i.status === "PENDING").length
    const rejected = items.filter((i) => i.status === "REJECTED").length

    const aprovadasPercent = total === 0 ? 0 : Math.round((approved / total) * 100)

    const values = items.map((i) => Number(i.value)).filter((n) => Number.isFinite(n))
    const totalValueNum = values.reduce((acc, v) => acc + v, 0)
    const ticketMedioNum = values.length === 0 ? 0 : totalValueNum / values.length

    return {
      total,
      approved,
      pending,
      rejected,
      aprovadasPercent,
      valorTotalVistoriado: totalValueNum.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      ticketMedio: ticketMedioNum.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    }
  }, [items])

  const topBrands = useMemo(() => {
    const map = new Map<string, number>()
    for (const i of items) {
      const key = (i.vehicleModel || "Não informado").trim()
      map.set(key, (map.get(key) || 0) + 1)
    }

    const list = Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    const max = list[0]?.value || 0
    return { list, max }
  }, [items])

  const sellers = useMemo<SellerRow[]>(() => {
    const map = new Map<string, { total: number; approved: number; rejected: number }>()
    for (const i of items) {
      const key = i.sellerId || "unknown"
      const row = map.get(key) || { total: 0, approved: 0, rejected: 0 }
      row.total += 1
      if (i.status === "APPROVED") row.approved += 1
      if (i.status === "REJECTED") row.rejected += 1
      map.set(key, row)
    }

    return Array.from(map.entries()).map(([sellerId, r]) => ({
      sellerId,
      total: r.total,
      approved: r.approved,
      rejected: r.rejected,
      efficacyPct: r.total === 0 ? 0 : Math.round((r.approved / r.total) * 100),
    }))
  }, [items])

  return { items, loading, error, metrics, topBrands, sellers }
}
