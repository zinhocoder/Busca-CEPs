"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import type { Address } from "@/types/address"
import { formatCep } from "@/utils/format-cep"
import { searchCep } from "@/utils/search-cep"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Search, Database } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CepFormProps {
  onSave: (address: Address) => void
  cepCache: Record<string, { data: Address; timestamp: number }>
  isCacheValid: (cacheKey: string, expirationTime?: number) => boolean
  savedAddresses: Address[] // Lista de endereços salvos
}

export default function CepForm({ onSave, cepCache, isCacheValid, savedAddresses }: CepFormProps) {
  const [cep, setCep] = useState("")
  const [address, setAddress] = useState<Partial<Address>>({
    cep: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    localidade: "",
    uf: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dataSource, setDataSource] = useState<"new" | "cache" | "saved">("new")

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCep = formatCep(e.target.value)
    setCep(formattedCep)
  }

  const handleCepBlur = async () => {
    if (cep.replace(/\D/g, "").length !== 8) {
      return
    }

    await fetchAddress(cep)
  }

  const fetchAddress = async (cepValue: string) => {
    setError("")
    const cleanCep = cepValue.replace(/\D/g, "")

    // Primeiro, verificar se o CEP já está nos endereços salvos
    const savedAddress = savedAddresses.find((addr) => addr.cep.replace(/\D/g, "") === cleanCep)

    if (savedAddress) {
      console.log("Using saved address data for CEP:", cleanCep)
      setAddress(savedAddress)
      setDataSource("saved")
      return
    }

    // Depois, verificar o cache com expiração
    if (cepCache[cleanCep] && isCacheValid(cleanCep)) {
      console.log("Using cached data for CEP:", cleanCep)
      setAddress(cepCache[cleanCep].data)
      setDataSource("cache")
      return
    }

    // Por último, fazer a requisição à API
    setLoading(true)
    setDataSource("new")

    try {
      const data = await searchCep(cleanCep)

      if (data.erro) {
        setError("CEP não encontrado")
        setAddress({
          cep: "",
          logradouro: "",
          complemento: "",
          bairro: "",
          localidade: "",
          uf: "",
        })
      } else {
        setAddress(data)
      }
    } catch (err) {
      setError("Erro ao buscar o CEP. Verifique sua conexão.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (cep.replace(/\D/g, "").length !== 8) {
      setError("CEP inválido. Digite um CEP com 8 dígitos.")
      return
    }

    if (!address.logradouro) {
      await fetchAddress(cep)
      return
    }

    if (address.cep && address.logradouro && address.bairro && address.localidade && address.uf) {
      onSave(address as Address)

      // Redefinir formulário após salvar com sucesso
      setCep("")
      setAddress({
        cep: "",
        logradouro: "",
        complemento: "",
        bairro: "",
        localidade: "",
        uf: "",
      })
      setDataSource("new")
    } else {
      setError("Preencha todos os campos obrigatórios")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const getDataSourceBadge = () => {
    if (dataSource === "saved") {
      return (
        <span className="elegant-badge bg-green-100 text-green-700 shadow-sm">
          <Database className="h-3.5 w-3.5 mr-1" />
          Salvo
        </span>
      )
    } else if (dataSource === "cache") {
      return (
        <span className="elegant-badge shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Cache
        </span>
      )
    }
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <Label htmlFor="cep" className="text-sm font-medium text-gray-700 mb-1.5 block">
            Digite o CEP para buscar o endereço
          </Label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                id="cep"
                name="cep"
                value={cep}
                onChange={handleCepChange}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                maxLength={9}
                className="elegant-input-lg font-medium tracking-wide"
              />
              {(dataSource === "cache" || dataSource === "saved") && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  {getDataSourceBadge()}
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={() => handleCepBlur()}
              disabled={loading || cep.replace(/\D/g, "").length !== 8}
              className="elegant-button-outline w-14 h-14 p-0 flex items-center justify-center"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="rounded-xl border-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="logradouro" className="text-sm font-medium text-gray-700">
              Logradouro
            </Label>
            <Input
              id="logradouro"
              name="logradouro"
              value={address.logradouro || ""}
              onChange={handleInputChange}
              placeholder="Rua, Avenida, etc."
              required
              className="elegant-input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="complemento" className="text-sm font-medium text-gray-700">
              Complemento
            </Label>
            <Input
              id="complemento"
              name="complemento"
              value={address.complemento || ""}
              onChange={handleInputChange}
              placeholder="Apto, Bloco, etc."
              className="elegant-input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bairro" className="text-sm font-medium text-gray-700">
              Bairro
            </Label>
            <Input
              id="bairro"
              name="bairro"
              value={address.bairro || ""}
              onChange={handleInputChange}
              placeholder="Bairro"
              required
              className="elegant-input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="localidade" className="text-sm font-medium text-gray-700">
              Cidade
            </Label>
            <Input
              id="localidade"
              name="localidade"
              value={address.localidade || ""}
              onChange={handleInputChange}
              placeholder="Cidade"
              required
              className="elegant-input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="uf" className="text-sm font-medium text-gray-700">
              Estado
            </Label>
            <Input
              id="uf"
              name="uf"
              value={address.uf || ""}
              onChange={handleInputChange}
              placeholder="UF"
              maxLength={2}
              required
              className="elegant-input uppercase"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="elegant-button w-full h-12 text-base" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Carregando
          </>
        ) : (
          "Salvar Endereço"
        )}
      </Button>
    </form>
  )
}

