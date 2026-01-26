import { useMemo, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "react-toastify"

type Reason = {
  id: string
  label: string
}

export default function ReasonsForRejection() {
  const [input, setInput] = useState("")
  const [reasons, setReasons] = useState<Reason[]>([
    { id: crypto.randomUUID(), label: "Pneu Careca" },
    { id: crypto.randomUUID(), label: "Chassi Adulterado" },
    { id: crypto.randomUUID(), label: "Vidro Trincado" },
    { id: crypto.randomUUID(), label: "Documentação Irregular" },
  ])

  const canAdd = useMemo(() => input.trim().length > 1, [input])

  function handleAdd() {
    const value = input.trim()

    if (value.length <= 1) {
      toast.warning("Digite um motivo válido")
      return
    }

    setReasons((prev) => [
      { id: crypto.randomUUID(), label: value },
      ...prev,
    ])

    setInput("")
    toast.success("Motivo adicionado com sucesso!", {
      toastId: "add-reason",
    })
  }

  function handleRemove(id: string) {
    setReasons((prev) => prev.filter((r) => r.id !== id))
    toast.info("Motivo removido")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleAdd()
  }

  return (
    <div className="w-full flex">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Gerenciar Motivos de Reprovação
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Adicione motivos padronizados para facilitar o processo de análise das vistorias.
          </p>

          <div className="mt-5 flex gap-3">
            <div className="flex-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: Documentação irregular, Veículo batido..."
                className="w-full h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!canAdd}
              className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              Adicionar
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {reasons.length === 0 ? (
              <div className="border rounded-lg p-4 text-sm text-gray-500">
                Nenhum motivo cadastrado ainda.
              </div>
            ) : (
              reasons.map((reason) => (
                <div
                  key={reason.id}
                  className="h-12 rounded-lg border border-gray-200 bg-white flex items-center justify-between px-4"
                >
                  <span className="text-sm text-gray-800">
                    {reason.label}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemove(reason.id)}
                    className="h-8 w-8 grid place-items-center rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    aria-label={`Remover motivo ${reason.label}`}
                    title="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
