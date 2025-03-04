export function formatCep(value: string): string {
  // Remove non-digits
  const cep = value.replace(/\D/g, "")

  // Format as 00000-000
  if (cep.length <= 5) {
    return cep
  }

  return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`
}

