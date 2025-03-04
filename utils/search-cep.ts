import type { Address } from "@/types/address"

export async function searchCep(cep: string): Promise<Address> {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

  if (!response.ok) {
    throw new Error("Failed to fetch address")
  }

  return response.json()
}

