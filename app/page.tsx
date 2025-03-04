"use client"

import { useState, useEffect } from "react"
import CepForm from "@/components/cep-form"
import AddressList from "@/components/address-list"
import StorageToggle from "@/components/storage-toggle"
import type { Address } from "@/types/address"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useIndexedDB } from "@/hooks/use-indexed-db"
import CacheInfo from "@/components/cache-info"
import AddressMap from "@/components/address-map"
import { MapPin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function Home() {
  const [storageType, setStorageType] = useState<"localStorage" | "indexedDB">("localStorage")
  const [addresses, setAddresses] = useState<Address[]>([])
  const [cepCache, setCepCache] = useState<Record<string, { data: Address; timestamp: number }>>({})
  const [currentAddress, setCurrentAddress] = useState<Partial<Address> | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const {
    getAddresses: getLocalStorageAddresses,
    saveAddress: saveLocalStorageAddress,
    updateAddress: updateLocalStorageAddress,
    deleteAddress: deleteLocalStorageAddress,
    clearAddresses: clearLocalStorageAddresses,
    isReady: localStorageReady,
  } = useLocalStorage()

  const {
    getAddresses: getIndexedDBAddresses,
    saveAddress: saveIndexedDBAddress,
    updateAddress: updateIndexedDBAddress,
    deleteAddress: deleteIndexedDBAddress,
    clearAddresses: clearIndexedDBAddresses,
    isReady: indexedDBReady,
    error: indexedDBError,
  } = useIndexedDB()

  // Se houver um erro no IndexedDB e esse for o tipo de armazenamento atual, muda para localStorage
  useEffect(() => {
    if (indexedDBError && storageType === "indexedDB") {
      console.warn("Erro no IndexedDB detectado, mudando para localStorage")
      setStorageType("localStorage")
    }
  }, [indexedDBError, storageType])

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        if (storageType === "localStorage") {
          const storedAddresses = await getLocalStorageAddresses()
          setAddresses(storedAddresses)
        } else if (storageType === "indexedDB" && indexedDBReady) {
          const storedAddresses = await getIndexedDBAddresses()
          setAddresses(storedAddresses)
        }
      } catch (error) {
        console.error("Erro ao carregar endereços:", error)
      }
    }

    loadAddresses()
  }, [storageType, getLocalStorageAddresses, getIndexedDBAddresses, indexedDBReady])

  useEffect(() => {
    const loadCache = () => {
      const storedCache = localStorage.getItem("cep-cache")
      if (storedCache) {
        try {
          const parsedCache = JSON.parse(storedCache)
          setCepCache(parsedCache)
        } catch (error) {
          console.error("Erro ao analisar cache:", error)
        }
      }
    }

    loadCache()
  }, [])

  const handleSaveAddress = async (address: Address) => {
    // Limpa erros anteriores
    setSaveError(null)

    // Atualiza o endereço atual para o mapa
    setCurrentAddress(address)

    // Atualiza o cache com timestamp
    const updatedCache = {
      ...cepCache,
      [address.cep.replace(/\D/g, "")]: {
        data: address,
        timestamp: Date.now(),
      },
    }

    setCepCache(updatedCache)

    // Persiste o cache no localStorage
    localStorage.setItem("cep-cache", JSON.stringify(updatedCache))

    try {
      // Salva no armazenamento selecionado
      if (storageType === "localStorage") {
        await saveLocalStorageAddress(address)

        // Atualiza a lista de endereços
        const updatedAddresses = await getLocalStorageAddresses()
        setAddresses(updatedAddresses)
      } else if (indexedDBReady) {
        await saveIndexedDBAddress(address)

        // Atualiza a lista de endereços
        const updatedAddresses = await getIndexedDBAddresses()
        setAddresses(updatedAddresses)
      } else {
        // Fallback para localStorage se IndexedDB não estiver pronto
        console.warn("IndexedDB não está pronto, usando localStorage como alternativa")
        await saveLocalStorageAddress(address)

        // Atualiza a lista de endereços
        const updatedAddresses = await getLocalStorageAddresses()
        setAddresses(updatedAddresses)
      }
    } catch (error) {
      console.error("Erro ao salvar endereço:", error)
      setSaveError("Erro ao salvar endereço. Tente novamente.")
    }
  }

  const handleUpdateAddress = async (address: Address) => {
    setSaveError(null)

    try {
      if (storageType === "localStorage") {
        await updateLocalStorageAddress(address)
        const updatedAddresses = await getLocalStorageAddresses()
        setAddresses(updatedAddresses)
      } else if (indexedDBReady) {
        await updateIndexedDBAddress(address)
        const updatedAddresses = await getIndexedDBAddresses()
        setAddresses(updatedAddresses)
      }
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error)
      setSaveError("Erro ao atualizar endereço. Tente novamente.")
    }
  }

  const handleDeleteAddress = async (cep: string) => {
    setSaveError(null)

    try {
      if (storageType === "localStorage") {
        await deleteLocalStorageAddress(cep)
        const updatedAddresses = await getLocalStorageAddresses()
        setAddresses(updatedAddresses)
      } else if (indexedDBReady) {
        await deleteIndexedDBAddress(cep)
        const updatedAddresses = await getIndexedDBAddresses()
        setAddresses(updatedAddresses)
      }
    } catch (error) {
      console.error("Erro ao excluir endereço:", error)
      setSaveError("Erro ao excluir endereço. Tente novamente.")
    }
  }

  const isCacheValid = (cacheKey: string, expirationTime = 24 * 60 * 60 * 1000) => {
    if (!cepCache[cacheKey]) return false

    const now = Date.now()
    const timestamp = cepCache[cacheKey].timestamp

    return now - timestamp < expirationTime
  }

  const handleClearCache = () => {
    setCepCache({})
    localStorage.removeItem("cep-cache")
  }

  const handleClearAll = async () => {
    // limpar Caches
    setCepCache({})
    localStorage.removeItem("cep-cache")

    // Limpar endereços
    try {
      if (storageType === "localStorage") {
        await clearLocalStorageAddresses()
        setAddresses([])
      } else if (indexedDBReady) {
        await clearIndexedDBAddresses()
        setAddresses([])
      }
    } catch (error) {
      console.error("Error clearing addresses:", error)
      setSaveError("Erro ao limpar endereços. Tente novamente.")
    }
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 animate-float">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h1 className="elegant-title mb-3">Consulta de CEP</h1>
          <p className="elegant-subtitle max-w-xl mx-auto">Encontre e gerencie endereços de forma simples e elegante</p>
        </div>

        {saveError && (
          <Alert variant="destructive" className="mb-6 rounded-xl border-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        {indexedDBError && storageType === "indexedDB" && (
          <Alert variant="destructive" className="mb-6 rounded-xl border-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Erro no IndexedDB. Usando localStorage como alternativa.</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-[1fr,380px] gap-8">
          <div className="space-y-8">
            <section className="elegant-panel p-8 animate-slide-up">
              <CepForm
                onSave={handleSaveAddress}
                cepCache={cepCache}
                isCacheValid={isCacheValid}
                savedAddresses={addresses}
              />
            </section>

            <section className="elegant-panel p-8 animate-slide-up delay-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Endereços Salvos</h2>
              <AddressList
                addresses={addresses}
                onUpdateAddress={handleUpdateAddress}
                onDeleteAddress={handleDeleteAddress}
              />
            </section>
          </div>

          <div className="space-y-6">
            <StorageToggle
              storageType={storageType}
              onToggle={(type) => {
                // Só permite mudar para IndexedDB se não estiver em estado de erro
                if (type === "indexedDB" && indexedDBError) {
                  setSaveError("IndexedDB não está disponível. Usando localStorage.")
                  return
                }
                setStorageType(type)
              }}
              indexedDBError={indexedDBError}
            />

            <CacheInfo cache={cepCache} onClearCache={handleClearCache} />

            <AddressMap address={currentAddress} />
          </div>
        </div>
      </div>
    </main>
  )
}

