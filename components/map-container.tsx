"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

interface MapContainerProps {
  coordinates: [number, number] | null
  loading?: boolean
}

export default function MapContainer({ coordinates, loading }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Garantir que estamos no cliente antes de tentar renderizar o mapa
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Inicializa o mapa e gerencia atualizações de marcadores
  useEffect(() => {
    if (!isClient) return

    // Verificar se o contêiner existe antes de prosseguir
    if (!mapRef.current) {
      console.log("Contêiner do mapa não disponível ainda, aguardando...")
      return
    }

    let isMounted = true
    let initAttempts = 0
    const maxAttempts = 5

    const initMap = async () => {
      try {
        // Verificar novamente se o contêiner existe e tem dimensões
        if (!mapRef.current) {
          console.error("Referência do contêiner do mapa é nula")
          if (initAttempts < maxAttempts) {
            initAttempts++
            setTimeout(initMap, 500)
          } else {
            setError("Não foi possível inicializar o mapa após várias tentativas")
          }
          return
        }

        // Verificar dimensões do contêiner
        const { clientWidth, clientHeight } = mapRef.current
        if (clientWidth === 0 || clientHeight === 0) {
          console.log("Contêiner do mapa tem dimensões zero, aguardando...")
          if (initAttempts < maxAttempts) {
            initAttempts++
            setTimeout(initMap, 500)
          } else {
            setError("Contêiner do mapa tem dimensões zero")
          }
          return
        }

        console.log("Dimensões do contêiner do mapa:", clientWidth, "x", clientHeight)

        // Importa Leaflet dinamicamente
        const L = await import("leaflet")

        // Verificar se o componente ainda está montado
        if (!isMounted) return

        // Inicializa o mapa se ele ainda não existir
        if (!leafletMapRef.current) {
          console.log("Criando nova instância do mapa")

          // Corrige problemas com ícones do Leaflet
          delete (L.Icon.Default.prototype as any)._getIconUrl
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          })

          // Cria o mapa
          leafletMapRef.current = L.map(mapRef.current).setView([-23.5505, -46.6333], 13)

          // Adiciona camada de tiles
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(leafletMapRef.current)

          // Invalida o tamanho após um pequeno atraso para lidar com problemas de renderização
          setTimeout(() => {
            if (leafletMapRef.current) {
              leafletMapRef.current.invalidateSize()
            }
          }, 100)
        }

        // Gerencia atualizações de marcadores
        if (coordinates && leafletMapRef.current) {
          // Remove o marcador existente, se houver
          if (markerRef.current) {
            markerRef.current.remove()
          }

          // Adiciona novo marcador
          markerRef.current = L.marker(coordinates).addTo(leafletMapRef.current)
          leafletMapRef.current.setView(coordinates, 16)
        }
      } catch (err) {
        console.error("Erro com o mapa:", err)
        setError("Falha ao inicializar o mapa: " + (err instanceof Error ? err.message : String(err)))
      }
    }

    // Inicia com um atraso para garantir que o DOM esteja pronto
    const timer = setTimeout(() => {
      initMap()
    }, 500)

    return () => {
      isMounted = false
      clearTimeout(timer)

      if (leafletMapRef.current) {
        console.log("Limpando mapa")
        leafletMapRef.current.remove()
        leafletMapRef.current = null
        markerRef.current = null
      }
    }
  }, [coordinates, isClient])

  if (!isClient) {
    return (
      <div className="bg-gray-100 rounded-xl w-full h-[300px] flex items-center justify-center">
        <MapPin className="w-8 h-8 text-gray-400" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-xl w-full h-[300px] flex items-center justify-center animate-pulse">
        <MapPin className="w-8 h-8 text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 rounded-xl w-full h-[300px] flex items-center justify-center">
        <div className="text-center p-4">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      id="map"
      ref={mapRef}
      className="w-full h-[300px] rounded-xl"
      style={{ height: "300px", width: "100%", display: "block" }}
    />
  )
}

