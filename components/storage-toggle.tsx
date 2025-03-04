import { Button } from "@/components/ui/button"
import { Database, HardDrive, AlertTriangle } from "lucide-react"

interface StorageToggleProps {
  storageType: "localStorage" | "indexedDB"
  onToggle: (type: "localStorage" | "indexedDB") => void
  indexedDBError?: string | null
}

export default function StorageToggle({ storageType, onToggle, indexedDBError }: StorageToggleProps) {
  return (
    <div className="elegant-panel p-2">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="ghost"
          className={`
            flex items-center gap-3 justify-start p-4 h-auto rounded-xl
            transition-all duration-200
            ${storageType === "localStorage" ? "bg-primary/10" : "hover:bg-gray-50"}
          `}
          onClick={() => onToggle("localStorage")}
        >
          <div
            className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            transition-all duration-200
            ${storageType === "localStorage" ? "bg-primary/20" : "bg-gray-100"}
          `}
          >
            <HardDrive
              className={`
              h-5 w-5 transition-colors
              ${storageType === "localStorage" ? "text-primary" : "text-gray-500"}
            `}
            />
          </div>
          <div className="text-left">
            <p
              className={`
              font-medium transition-colors
              ${storageType === "localStorage" ? "text-primary" : "text-gray-700"}
            `}
            >
              LocalStorage
            </p>
            <p className="text-xs text-gray-500">Armazenamento local</p>
          </div>
        </Button>

        <Button
          variant="ghost"
          className={`
            flex items-center gap-3 justify-start p-4 h-auto rounded-xl
            transition-all duration-200
            ${storageType === "indexedDB" ? "bg-primary/10" : "hover:bg-gray-50"}
            ${indexedDBError ? "opacity-60 cursor-not-allowed" : ""}
          `}
          onClick={() => !indexedDBError && onToggle("indexedDB")}
          disabled={!!indexedDBError}
        >
          <div
            className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            transition-all duration-200
            ${storageType === "indexedDB" ? "bg-primary/20" : indexedDBError ? "bg-red-50" : "bg-gray-100"}
          `}
          >
            {indexedDBError ? (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            ) : (
              <Database
                className={`
                h-5 w-5 transition-colors
                ${storageType === "indexedDB" ? "text-primary" : "text-gray-500"}
              `}
              />
            )}
          </div>
          <div className="text-left">
            <p
              className={`
              font-medium transition-colors
              ${storageType === "indexedDB" ? "text-primary" : indexedDBError ? "text-gray-400" : "text-gray-700"}
            `}
            >
              IndexedDB
            </p>
            <p className="text-xs text-gray-500">{indexedDBError ? "Indisponível" : "Banco de dados local"}</p>
          </div>
        </Button>
      </div>
    </div>
  )
}

