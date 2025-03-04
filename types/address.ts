export interface Address {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  type?: "home" | "work" | "default"
}

