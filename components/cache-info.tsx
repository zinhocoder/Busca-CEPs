"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Clock, Trash2 } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CacheInfoProps {
  cache: Record<string, { data: any; timestamp: number }>
  onClearCache: () => void
}

export default function CacheInfo({ cache, onClearCache }: CacheInfoProps) {
  const [isOpen, setIsOpen] = useState(false)

  const cacheEntries = Object.entries(cache)
  const cacheSize = cacheEntries.length

  if (cacheSize === 0) return null

  const calculateAge = (timestamp: number) => {
    const now = Date.now()
    const ageMs = now - timestamp

    if (ageMs < 60000) return "menos de 1 minuto"
    if (ageMs < 3600000) return `${Math.floor(ageMs / 60000)} minutos`
    if (ageMs < 86400000) return `${Math.floor(ageMs / 3600000)} horas`
    return `${Math.floor(ageMs / 86400000)} dias`
  }

  return (
    <div className="elegant-panel p-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 p-0 h-auto hover:bg-transparent">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Cache de CEPs</p>
                <p className="text-sm text-gray-500">
                  {cacheSize} {cacheSize === 1 ? "entrada" : "entradas"}
                </p>
              </div>
            </Button>
          </CollapsibleTrigger>

          <Button variant="outline" size="sm" onClick={onClearCache} className="elegant-button-outline gap-2">
            <Trash2 className="h-4 w-4" />
            Limpar Cache
          </Button>
        </div>

        <CollapsibleContent>
          <div className="mt-6 rounded-xl border border-gray-100 overflow-hidden bg-white/50">
            <div className="overflow-x-auto">
              <table className="elegant-table">
                <thead>
                  <tr>
                    <th>CEP</th>
                    <th>Endereço</th>
                    <th>Idade</th>
                  </tr>
                </thead>
                <tbody>
                  {cacheEntries.map(([cep, { data, timestamp }]) => (
                    <tr key={cep}>
                      <td className="font-medium text-gray-900">{data.cep}</td>
                      <td>
                        {data.logradouro}, {data.bairro}
                      </td>
                      <td className="whitespace-nowrap">{calculateAge(timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

