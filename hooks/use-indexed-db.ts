"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { Address } from "@/types/address"

const DB_NAME = "CepAddressesDB"
const STORE_NAME = "addresses"
const DB_VERSION = 1

export function useIndexedDB() {
  const [isReady, setIsReady] = useState(false)
  const dbRef = useRef<IDBDatabase | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Inicializa o banco de dados
  useEffect(() => {
    let isMounted = true

    const openDB = () => {
      if (typeof window === "undefined") return

      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: "cep" })
            store.createIndex("cep", "cep", { unique: true })
          }
        }

        request.onsuccess = (event) => {
          if (!isMounted) {
            // Se o componente foi desmontado, fecha o DB e não atualiza o estado
            const db = (event.target as IDBOpenDBRequest).result
            db.close()
            return
          }

          dbRef.current = (event.target as IDBOpenDBRequest).result

          // Escuta eventos de fechamento
          dbRef.current.onclose = () => {
            console.log("Conexão com IndexedDB fechada")
            dbRef.current = null
          }

          setIsReady(true)
          setError(null)
        }

        request.onerror = (event) => {
          console.error("Erro no IndexedDB:", (event.target as IDBOpenDBRequest).error)
          setError("Falha ao abrir o banco de dados")
          setIsReady(true) // Ainda define como pronto para podermos usar alternativas
        }
      } catch (err) {
        console.error("Erro ao abrir IndexedDB:", err)
        setError("Falha ao inicializar o banco de dados")
        setIsReady(true)
      }
    }

    openDB()

    return () => {
      isMounted = false
      // Fecha a conexão com o banco de dados quando o componente é desmontado
      if (dbRef.current) {
        dbRef.current.close()
        dbRef.current = null
      }
    }
  }, [])

  const getAddresses = useCallback(async (): Promise<Address[]> => {
    if (!dbRef.current) {
      console.warn("Banco de dados não está pronto ou foi fechado")
      return []
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = dbRef.current.transaction(STORE_NAME, "readonly")
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
          resolve(request.result)
        }

        request.onerror = () => {
          console.error("Erro ao buscar endereços do IndexedDB:", request.error)
          reject(request.error)
        }
      } catch (err) {
        console.error("Erro na transação em getAddresses:", err)
        resolve([]) // Retorna array vazio em caso de erro
      }
    })
  }, [])

  const saveAddress = useCallback(async (address: Address): Promise<void> => {
    if (!dbRef.current) {
      console.warn("Banco de dados não está pronto ou foi fechado")
      return
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = dbRef.current.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)

        // Normaliza o CEP para garantir armazenamento consistente
        const normalizedAddress = {
          ...address,
          cep: address.cep.replace(/\D/g, ""),
        }

        const request = store.put(normalizedAddress)

        request.onsuccess = () => {
          resolve()
        }

        request.onerror = () => {
          console.error("Erro ao salvar endereço no IndexedDB:", request.error)
          reject(request.error)
        }
      } catch (err) {
        console.error("Erro na transação em saveAddress:", err)
        resolve() // Resolve mesmo assim para evitar que o app trave
      }
    })
  }, [])

  const updateAddress = useCallback(
    async (address: Address): Promise<void> => {
      // Para IndexedDB, atualizar é o mesmo que salvar, já que usamos put
      return saveAddress(address)
    },
    [saveAddress],
  )

  const deleteAddress = useCallback(async (cep: string): Promise<void> => {
    if (!dbRef.current) {
      console.warn("Banco de dados não está pronto ou foi fechado")
      return
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = dbRef.current.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)

        // Normaliza o CEP
        const normalizedCep = cep.replace(/\D/g, "")
        const request = store.delete(normalizedCep)

        request.onsuccess = () => {
          resolve()
        }

        request.onerror = () => {
          console.error("Erro ao excluir endereço do IndexedDB:", request.error)
          reject(request.error)
        }
      } catch (err) {
        console.error("Erro na transação em deleteAddress:", err)
        resolve() // Resolve mesmo assim para evitar que o app trave
      }
    })
  }, [])

  const clearAddresses = useCallback(async (): Promise<void> => {
    if (!dbRef.current) {
      console.warn("Banco de dados não está pronto ou foi fechado")
      return
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = dbRef.current.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)
        const request = store.clear()

        request.onsuccess = () => {
          resolve()
        }

        request.onerror = () => {
          console.error("Erro ao limpar endereços do IndexedDB:", request.error)
          reject(request.error)
        }
      } catch (err) {
        console.error("Erro na transação em clearAddresses:", err)
        resolve() // Resolve mesmo assim para evitar que o app trave
      }
    })
  }, [])

  return {
    getAddresses,
    saveAddress,
    updateAddress,
    deleteAddress,
    clearAddresses,
    isReady,
    error,
  }
}

