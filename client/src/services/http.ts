type HttpArgs = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  token?: string
  body?: unknown
  query?: Record<string, any>
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

export async function http<T = unknown>({
  method,
  path,
  token,
  body,
  query,
}: HttpArgs): Promise<T> {
  const url = new URL(API_URL + path)

  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return
      url.searchParams.set(k, String(v))
    })
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  // tenta ler mensagem de erro (quando existe)
  if (!res.ok) {
    let message = 'Erro na requisição'
    try {
      const data = await res.json()
      message = data?.message ?? message
    } catch {
      // pode não ter body
    }
    throw new Error(message)
  }

  // ✅ aqui é o ponto: 204/205 e resposta vazia não tem JSON
  if (res.status === 204 || res.status === 205) {
    return undefined as T
  }

  // ✅ se não tiver conteúdo (alguns backends respondem 200 sem body)
  const text = await res.text()
  if (!text) return undefined as T

  return JSON.parse(text) as T
}
