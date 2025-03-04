"use client"

import { useEffect, useRef, useState } from "react"
import "leaflet/dist/leaflet.css"
import { MapPin } from "lucide-react"

interface MapProps {
  coordinates: [number, number] | null
  loading?: boolean
}

export default function Map({ coordinates, loading }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    // Execute este efeito apenas no navegador
    if (typeof window === "undefined") return

    // Certifica de que o contêiner exista e tenha dimensões
    if (!mapContainerRef.current) {
      console.error("Map container not found")
      setMapError("Map container not found")
      return
    }

    // Importe o folheto dinamicamente para evitar problemas de SSR
    const initializeMap = async () => {
      try {
        // Aguarda até o container renderizar
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Checa se o container tem dimensões
        if (
          mapContainerRef.current &&
          (mapContainerRef.current.clientWidth === 0 || mapContainerRef.current.clientHeight === 0)
        ) {
          console.error("Map container has zero dimensions")
          setMapError("Map container has zero dimensions")
          return
        }

        // Import do leaflet
        const L = (await import("leaflet")).default

        // Fixa os ícones
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
        })

        // Inicialize o mapa se ele não existir
        if (!mapInstanceRef.current && mapContainerRef.current) {
          console.log("Initializing map")
          mapInstanceRef.current = L.map(mapContainerRef.current).setView([-23.5505, -46.6333], 13) // São Paulo é loc default

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }).addTo(mapInstanceRef.current)
        }

        // Atualizar se cordenada muda
        if (coordinates && mapInstanceRef.current) {
          if (markerRef.current) {
            markerRef.current.remove()
          }

          markerRef.current = L.marker(coordinates).addTo(mapInstanceRef.current)
          mapInstanceRef.current.setView(coordinates, 16)
        }
      } catch (error) {
        console.error("Error initializing map:", error)
        setMapError("Failed to initialize map")
      }
    }

    initializeMap()

    // Clear função
    return () => {
      if (mapInstanceRef.current) {
        console.log("Cleaning up map")
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [coordinates])

  // Força renderização se POU-UP for redimensionada
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-xl w-full h-[300px] flex items-center justify-center">
        <MapPin className="w-8 h-8 text-gray-400" />
      </div>
    )
  }

  if (mapError) {
    return (
      <div className="bg-gray-50 rounded-xl w-full h-[300px] flex items-center justify-center">
        <div className="text-center p-4">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Não foi possível carregar o mapa</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={mapContainerRef}
      id="map-container"
      className="w-full h-[300px] rounded-xl overflow-hidden"
      style={{ minHeight: "300px" }}
    />
  )
}

