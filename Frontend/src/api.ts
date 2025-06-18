export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  const res = await fetch(`http://localhost:8080${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}
