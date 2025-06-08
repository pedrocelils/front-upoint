import type React from "react"
export type ActivePage =
  | "dashboard"
  | "cadastro-funcionario"
  | "cadastro-empresa"
  | "maintenance"
  | "relatorios-horas"
  | "relatorios-historico"
  | "configuracoes-localizacao"

export interface NavigationItem {
  id: ActivePage
  title: string
  icon?: React.ReactNode
  children?: NavigationItem[]
}
