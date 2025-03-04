"use client"

import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import type { Address } from "@/types/address"
import dynamic from "next/dynamic"

// Importa o CSS diretamente aqui
import "leaflet/dist/leaflet.css"

// Importa dinamicamente o componente Map sem SSR
const MapContainer = dynamic(() => import("./map-container"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-100 rounded-xl w-full h-[300px] flex items-center justify-center">
      <MapPin className="w-8 h-8 text-gray-400" />
    </div>
  ),
})

interface AddressMapProps {
  address: Partial<Address> | null
}

export default function AddressMap({ address }: AddressMapProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mapKey, setMapKey] = useState(0) // Chave para forçar re-renderização do mapa

  useEffect(() => {
    const getCoordinates = async () => {
      if (!address?.logradouro || !address?.localidade || !address?.uf) {
        setCoordinates(null)
        return
      }

      setLoading(true)
      setError("")

      try {
        const query = `${address.logradouro}, ${address.bairro}, ${address.localidade}, ${address.uf}, Brasil`
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        )
        const data = await response.json()

        if (data && data[0]) {
          setCoordinates([Number.parseFloat(data[0].lat), Number.parseFloat(data[0].lon)])
          // Forçar re-renderização do mapa quando as coordenadas mudarem
          setMapKey((prev) => prev + 1)
        } else {
          setError("Localização não encontrada")
        }
      } catch (err) {
        setError("Erro ao buscar coordenadas")
        console.error("Erro ao buscar coordenadas:", err)
      } finally {
        setLoading(false)
      }
    }

    getCoordinates()
  }, [address])

  if (!address) {
    return (
      <div className="elegant-panel p-8">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100/50 backdrop-blur-sm mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-600">Busque um CEP para ver no mapa</p>
        </div>
      </div>
    )
  }

  return (
    <div className="elegant-panel p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Localização no Mapa</h3>
          <p className="text-sm text-gray-500">
            {address.logradouro}, {address.bairro}
          </p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-100/50">
        {error ? (
          <div className="bg-gray-50/50 w-full h-[300px] flex items-center justify-center">
            <p className="text-gray-500">{error}</p>
          </div>
        ) : (
          <div className="w-full h-[300px]" key={mapKey}>
            <MapContainer coordinates={coordinates} loading={loading} />
          </div>
        )}
      </div>
    </div>
  )
}

