import type { ActivePage } from "../types/navigation"

export function getPageTitle(activePage: ActivePage): string {
  switch (activePage) {
    case "dashboard":
      return "Dashboard"
    case "cadastro-funcionario":
      return "Cadastro de Funcionário"
    case "cadastro-empresa":
      return "Cadastro de Empresa"
    case "maintenance":
      return "Manuteção de Registros"
    case "relatorios-horas":
      return "Relatórios - Horas Extras"
    case "relatorios-historico":
      return "Relatórios - Histórico"
    case "configuracoes-localizacao":
      return "Configurações - Localização"
    default:
      return "Dashboard"
  }
}
