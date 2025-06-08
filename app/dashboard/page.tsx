"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "../../components/layout/sidebar"
import { DashboardContent } from "../../components/dashboard/dashboard-content"
import { useDashboardData } from "../../hooks/use-dashboard-data"
import { getPageTitle } from "../../utils/page-utils"
import type { ActivePage } from "../../types/navigation"

// Importar os componentes das páginas
import CadastroFuncionarioComponent from "../cadastro-funcionario/page"
import CadastroEmpresaComponent from "../cadastro-empresa/page"
import RelatoriosComponent from "../reports/relatorios-historico/page"
import RelatoriosComponentHoras from "../reports/relatorios-horas/page"
import ManutencaoRegistros from "../maintenance/page"

export default function HomeScreen() {
  const [activePage, setActivePage] = useState<ActivePage>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { totalFuncionarios, totalRegistros, loading } = useDashboardData()

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const handlePageChange = (page: ActivePage) => {
    setActivePage(page)
  }

  const renderMainContent = () => {
    switch (activePage) {
      case "cadastro-funcionario":
        return <CadastroFuncionarioComponent />
      case "cadastro-empresa":
        return <CadastroEmpresaComponent />
      case "maintenance":
        return <ManutencaoRegistros />
      case "relatorios-horas":
        return <RelatoriosComponentHoras />
      case "relatorios-historico":
        return <RelatoriosComponent />
      case "configuracoes-localizacao":
       // return <ConfiguracoesLocalizacao  />
       return "teste"
      default:
        return <DashboardContent totalFuncionarios={totalFuncionarios} totalRegistros={totalRegistros} />
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Sidebar
        activePage={activePage}
        onPageChange={handlePageChange}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main content */}
      <div className={cn("flex-1 transition-all duration-300", sidebarOpen ? "lg:ml-64" : "ml-0")}>
        <header className="bg-white h-16 shadow-sm flex items-center px-6 border-b border-blue-100">
          <h2 className="text-xl font-semibold text-gray-800">{getPageTitle(activePage)}</h2>
        </header>
        <main className="p-6 h-[calc(100vh-4rem)] overflow-auto">{renderMainContent()}</main>
      </div>
    </div>
  )
}
