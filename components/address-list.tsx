import type { Address } from "@/types/address"
import AddressCard from "@/components/address-card"
import { MapPinOff } from "lucide-react"

interface AddressListProps {
  addresses: Address[]
  onUpdateAddress: (address: Address) => void
  onDeleteAddress: (cep: string) => void
}

export default function AddressList({ addresses, onUpdateAddress, onDeleteAddress }: AddressListProps) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100/50 backdrop-blur-sm mb-4">
          <MapPinOff className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-lg font-medium text-gray-600">Nenhum endereço salvo</p>
        <p className="text-gray-500 mt-1">Use o formulário acima para adicionar endereços</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {addresses.map((address, index) => (
        <AddressCard
          key={`${address.cep}-${index}`}
          address={address}
          onUpdate={onUpdateAddress}
          onDelete={onDeleteAddress}
        />
      ))}
    </div>
  )
}

