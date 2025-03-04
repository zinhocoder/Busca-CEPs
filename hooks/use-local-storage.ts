"use client"

import { useState, useCallback, useEffect } from "react"
import type { Address } from "@/types/address"

const STORAGE_KEY = "cep-addresses"

export function useLocalStorage() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  const getAddresses = useCallback(async (): Promise<Address[]> => {
    if (typeof window === "undefined") return []

    const storedData = localStorage.getItem(STORAGE_KEY)
    if (!storedData) return []

    try {
      return JSON.parse(storedData)
    } catch (error) {
      console.error("Erro ao analisar endereços armazenados:", error)
      return []
    }
  }, [])

  const saveAddress = useCallback(
    async (address: Address): Promise<void> => {
      if (typeof window === "undefined") return

      const addresses = await getAddresses()

      // Verifica se o endereço já existe pelo CEP
      const exists = addresses.some((addr) => addr.cep.replace(/\D/g, "") === address.cep.replace(/\D/g, ""))

      // Se existir, atualiza; caso contrário, adiciona
      const updatedAddresses = exists
        ? addresses.map((addr) => (addr.cep.replace(/\D/g, "") === address.cep.replace(/\D/g, "") ? address : addr))
        : [...addresses, address]

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses))
    },
    [getAddresses],
  )

  const updateAddress = useCallback(
    async (address: Address): Promise<void> => {
      if (typeof window === "undefined") return

      const addresses = await getAddresses()

      const updatedAddresses = addresses.map((addr) =>
        addr.cep.replace(/\D/g, "") === address.cep.replace(/\D/g, "") ? address : addr,
      )

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses))
    },
    [getAddresses],
  )

  const deleteAddress = useCallback(
    async (cep: string): Promise<void> => {
      if (typeof window === "undefined") return

      const addresses = await getAddresses()

      const updatedAddresses = addresses.filter((addr) => addr.cep.replace(/\D/g, "") !== cep.replace(/\D/g, ""))

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses))
    },
    [getAddresses],
  )

  const clearAddresses = useCallback(async (): Promise<void> => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    getAddresses,
    saveAddress,
    updateAddress,
    deleteAddress,
    clearAddresses,
    isReady,
  }
}

