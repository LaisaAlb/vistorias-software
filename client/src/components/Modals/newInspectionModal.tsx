import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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

const schema = z.object({
  customerName: z
    .string()
    .min(3, 'Informe o nome do cliente')
    .max(120, 'Nome muito longo'),
  plate: z
    .string()
    .min(7, 'Placa inválida')
    .max(8, 'Placa inválida')
    .transform((v) => v.toUpperCase().replace(/[^A-Z0-9]/g, ''))
    .refine((v) => /^[A-Z]{3}\d{4}$/.test(v) || /^[A-Z]{3}\d[A-Z]\d{2}$/.test(v), {
      message: 'Formato: ABC1234 ou ABC1D23',
    }),
  vehicleYear: z
    .coerce.number()
    .int('Ano inválido')
    .min(1900, 'Ano inválido')
    .max(new Date().getFullYear() + 1, 'Ano inválido'),
  vehicleModel: z
    .string()
    .min(2, 'Informe o modelo')
    .max(120, 'Modelo muito longo'),
  value: z
    .string()
    .min(1, 'Informe o valor')
    .refine((v) => {
      const cents = moneyToCents(v)
      return Number.isFinite(cents) && cents > 0
    }, 'Valor inválido'),
})

type FormData = z.infer<typeof schema>

function onlyDigits(s: string) {
  return s.replace(/\D/g, '')
}

function moneyToCents(v: string): number {
  const digits = onlyDigits(v)
  if (!digits) return NaN
  return Number(digits)
}

function centsToBRL(cents: number): string {
  const value = cents / 100
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatPlateInput(raw: string) {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
  return cleaned.slice(0, 8)
}

export function NewInspectionModal({ open, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      customerName: '',
      plate: '',
      vehicleModel: '',
      vehicleYear: new Date().getFullYear(),
      value: '',
    },
  })

  const plate = watch('plate')
  const value = watch('value')

  const valuePlaceholder = useMemo(() => 'R$ 0,00', [])

  useEffect(() => {
    if (!open) return
    clearErrors()
  }, [open, clearErrors])

  if (!open) return null

  async function submit(data: FormData) {
    try {
      const cents = moneyToCents(data.value)
      const valueNumber = cents / 100 // 35000.00

      await onSubmit({
        customerName: data.customerName.trim(),
        plate: data.plate,
        vehicleModel: data.vehicleModel.trim(),
        vehicleYear: data.vehicleYear,
        value: String(valueNumber), // ou valueNumber se seu backend aceitar number
      })

      onClose()
      reset()
    } catch (e) {
      setError('root', {
        type: 'server',
        message: e instanceof Error ? e.message : 'Erro ao criar vistoria',
      })
    }
  }



  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-white rounded-xl border shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Nova Vistoria</h2>
          <button onClick={onClose} type="button" className="text-gray-500">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Nome do cliente</label>
              <input
                className={[
                  'w-full border rounded-lg px-3 py-2',
                  errors.customerName ? 'border-red-300' : '',
                ].join(' ')}
                {...register('customerName')}
                placeholder="Ex: João Silva"
              />
              {errors.customerName && (
                <p className="text-xs text-red-600 mt-1">{errors.customerName.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Placa</label>
              <input
                className={[
                  'w-full border rounded-lg px-3 py-2',
                  errors.plate ? 'border-red-300' : '',
                ].join(' ')}
                value={plate ?? ''}
                placeholder="ABC1234"
                autoCapitalize="characters"
                {...register('plate')}
                onChange={(e) => {
                  const formatted = formatPlateInput(e.target.value)
                  setValue('plate', formatted, { shouldValidate: true, shouldDirty: true })
                }}
              />
              {errors.plate && (
                <p className="text-xs text-red-600 mt-1">{errors.plate.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Ano</label>
              <input
                className={[
                  'w-full border rounded-lg px-3 py-2',
                  errors.vehicleYear ? 'border-red-300' : '',
                ].join(' ')}
                type="number"
                inputMode="numeric"
                {...register('vehicleYear')}
              />
              {errors.vehicleYear && (
                <p className="text-xs text-red-600 mt-1">{errors.vehicleYear.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Modelo</label>
              <input
                className={[
                  'w-full border rounded-lg px-3 py-2',
                  errors.vehicleModel ? 'border-red-300' : '',
                ].join(' ')}
                {...register('vehicleModel')}
                placeholder="Ex: Honda Civic"
              />
              {errors.vehicleModel && (
                <p className="text-xs text-red-600 mt-1">{errors.vehicleModel.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Valor</label>
              <input
                className={[
                  'w-full border rounded-lg px-3 py-2',
                  errors.value ? 'border-red-300' : '',
                ].join(' ')}
                value={value ?? ''}
                placeholder={valuePlaceholder}
                inputMode="numeric"
                {...register('value')}
                onChange={(e) => {
                  const digits = onlyDigits(e.target.value)
                  if (!digits) {
                    setValue('value', '', { shouldValidate: true, shouldDirty: true })
                    return
                  }
                  const cents = Number(digits)
                  const formatted = centsToBRL(cents)
                  setValue('value', formatted, { shouldValidate: true, shouldDirty: true })
                }}
              />
              {errors.value && (
                <p className="text-xs text-red-600 mt-1">{errors.value.message}</p>
              )}
            </div>
          </div>

          {errors.root?.message && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
              {errors.root.message}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button className="border rounded-lg px-4 py-2" onClick={onClose} type="button">
              Cancelar
            </button>

            <button
              className="bg-blue-600 text-white rounded-lg px-4 py-2 disabled:opacity-60"
              disabled={isSubmitting || !isValid}
              type="submit"
              title={!isValid ? 'Preencha os campos corretamente' : 'Cadastrar vistoria'}
            >
              {isSubmitting ? 'Salvando...' : 'Cadastrar Vistoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
