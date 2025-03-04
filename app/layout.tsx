import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Consulta de CEP",
  description: "Encontre e gerencie endereços de forma simples e elegante",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>{/* Não incluir css/js aqui */}</head>
      <body>{children}</body>
    </html>
  )
}



import './globals.css'