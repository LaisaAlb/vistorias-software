import { useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    customerName: string
    plate: string
    vehicleModel: string
    vehicleYear: number
    value: string
  }) => Promise<void>
}

export function NewInspectionModal({ open, onClose, onSubmit }: Props) {
  const [customerName, setCustomerName] = useState('')
  const [plate, setPlate] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [vehicleYear, setVehicleYear] = useState<number>(2020)
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  async function handleSubmit() {
    setError(null)
    setLoading(true)
    try {
      await onSubmit({
        customerName,
        plate,
        vehicleModel,
        vehicleYear,
        value,
      })
      onClose()
      setCustomerName('')
      setPlate('')
      setVehicleModel('')
      setValue('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao criar vistoria')
    } finally {
    setLoading(false)
  }
}

return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
    <div className="w-full max-w-lg bg-white rounded-xl border shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Nova Vistoria</h2>
        <button onClick={onClose} type="button" className="text-gray-500">✕</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Nome do cliente</label>
          <input className="w-full border rounded-lg px-3 py-2"
            value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </div>

        <div>
          <label className="text-sm text-gray-600">Placa</label>
          <input className="w-full border rounded-lg px-3 py-2"
            value={plate} onChange={(e) => setPlate(e.target.value)} />
        </div>

        <div>
          <label className="text-sm text-gray-600">Ano</label>
          <input className="w-full border rounded-lg px-3 py-2" type="number"
            value={vehicleYear} onChange={(e) => setVehicleYear(Number(e.target.value))} />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Modelo</label>
          <input className="w-full border rounded-lg px-3 py-2"
            value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Valor</label>
          <input className="w-full border rounded-lg px-3 py-2"
            value={value} onChange={(e) => setValue(e.target.value)} placeholder="35000" />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button className="border rounded-lg px-4 py-2" onClick={onClose} type="button">
          Cancelar
        </button>
        <button
          className="bg-blue-600 text-white rounded-lg px-4 py-2 disabled:opacity-60"
          onClick={handleSubmit}
          disabled={loading}
          type="button"
        >
          {loading ? 'Salvando...' : 'Cadastrar Vistoria'}
        </button>
      </div>
    </div>
  </div>
)
}
