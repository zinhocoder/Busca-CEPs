"use client"

import { useState } from "react"
import type { Address } from "@/types/address"
import { MapPin, Home, Briefcase, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddressCardProps {
  address: Address
  onUpdate: (address: Address) => void
  onDelete: (cep: string) => void
}

export default function AddressCard({ address, onUpdate, onDelete }: AddressCardProps) {
  const [showOptions, setShowOptions] = useState(false)

  const getIcon = () => {
    switch (address.type) {
      case "home":
        return <Home className="w-6 h-6 text-primary" />
      case "work":
        return <Briefcase className="w-6 h-6 text-primary" />
      default:
        return <MapPin className="w-6 h-6 text-primary" />
    }
  }

  const getTitle = () => {
    switch (address.type) {
      case "home":
        return "Casa"
      case "work":
        return "Trabalho"
      default:
        return null
    }
  }

  const handleSetType = (type: "home" | "work" | "default") => {
    onUpdate({ ...address, type })
    setShowOptions(false)
  }

  const handleDelete = () => {
    onDelete(address.cep)
  }

  return (
    <div
      className="elegant-card p-4 group relative"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div
            className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center
            group-hover:scale-110 transition-transform duration-300"
          >
            {getIcon()}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <p className="text-base font-semibold text-gray-900">{address.cep}</p>
              {getTitle() && <p className="text-xs text-primary font-medium -mt-1">{getTitle()}</p>}
            </div>
            <span className="elegant-badge">{address.uf}</span>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-600 truncate">
              {address.logradouro}
              {address.complemento && `, ${address.complemento}`}
            </p>
            <p className="text-sm text-gray-600 truncate">
              {address.bairro}, {address.localidade}
            </p>
          </div>
        </div>
      </div>

      {/* Menu de opções que aparece ao passar o mouse */}
      {showOptions && (
        <div className="absolute top-2 right-2 bg-white shadow-lg rounded-lg p-1 animate-fade-in z-10">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center justify-start gap-2 h-8 px-2 text-xs"
              onClick={() => handleSetType("home")}
            >
              <Home className="h-3.5 w-3.5" />
              <span>Definir como Casa</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center justify-start gap-2 h-8 px-2 text-xs"
              onClick={() => handleSetType("work")}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Definir como Trabalho</span>
            </Button>
            {address.type && address.type !== "default" && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-start gap-2 h-8 px-2 text-xs"
                onClick={() => handleSetType("default")}
              >
                <X className="h-3.5 w-3.5" />
                <span>Remover definição</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center justify-start gap-2 h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Excluir endereço</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

