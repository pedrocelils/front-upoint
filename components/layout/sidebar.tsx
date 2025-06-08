"use client"

import { useState } from "react"
import { ChevronDown, Home, Users, FileText, Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MenuItemButton } from "./menu-item-button"
import { UserProfileMenu } from "./user-profile-menu"

type ActivePage =
  | "dashboard"
  | "cadastro-funcionario"
  | "cadastro-empresa"
  | "maintenance"
  | "relatorios-horas"
  | "relatorios-historico"
  | "configuracoes-localizacao"

interface SidebarProps {
  activePage: ActivePage
  onPageChange: (page: ActivePage) => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function Sidebar({ activePage, onPageChange, sidebarOpen, onToggleSidebar }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    cadastro: false,
    manutencao: false,
    relatorios: false,
    configurations: false,
  })

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleSidebar}
          className="bg-white border-blue-200 hover:bg-blue-50"
        >
          {sidebarOpen ? <X size={20} className="text-blue-600" /> : <Menu size={20} className="text-blue-600" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 border-r border-blue-100",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-blue-100">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-blue-600">Upoint</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-2">
          <MenuItemButton
            icon={<Home size={20} />}
            text="Home"
            active={activePage === "dashboard"}
            onClick={() => onPageChange("dashboard")}
          />

          {/* Cadastro submenu */}
          <div className="mt-2">
            <button
              onClick={() => toggleMenu("cadastro")}
              className="flex w-full items-center justify-between rounded-md px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-blue-50"
            >
              <div className="flex items-center">
                <Users size={20} className="mr-3 text-blue-600" />
                <span>Cadastro</span>
              </div>
              <ChevronDown
                size={16}
                className={cn("transition-transform duration-200", openMenus.cadastro ? "rotate-180" : "")}
              />
            </button>
            <div
              className={cn(
                "mt-1 space-y-1 pl-10 transition-all duration-200",
                openMenus.cadastro ? "block" : "hidden",
              )}
            >
              <MenuItemButton
                text="Funcionário"
                active={activePage === "cadastro-funcionario"}
                onClick={() => onPageChange("cadastro-funcionario")}
              />
              <MenuItemButton
                text="Empresa"
                active={activePage === "cadastro-empresa"}
                onClick={() => onPageChange("cadastro-empresa")}
              />
            </div>
          </div>

          <div className="mt-2">
            <button
              onClick={() => toggleMenu("manutencao")}
              className="flex w-full items-center justify-between rounded-md px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-blue-50"
            >
              <div className="flex items-center">
                <Users size={20} className="mr-3 text-blue-600" />
                <span>Manutenção</span>
              </div>
              <ChevronDown
                size={16}
                className={cn("transition-transform duration-200", openMenus.manutencao ? "rotate-180" : "")}
              />
            </button>
            <div
              className={cn(
                "mt-1 space-y-1 pl-10 transition-all duration-200",
                openMenus.manutencao ? "block" : "hidden",
              )}
            >
              <MenuItemButton
                text="Registros"
                active={activePage === "maintenance"}
                onClick={() => onPageChange("maintenance")}
              />
              {/*<MenuItemButton
                text="Pendências"
                active={activePage === ""}
                onClick={() => onPageChange("")}
              />*/}
            </div>
          </div>

          {/* Relatórios submenu */}
          <div className="mt-2">
            <button
              onClick={() => toggleMenu("relatorios")}
              className="flex w-full items-center justify-between rounded-md px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-blue-50"
            >
              <div className="flex items-center">
                <FileText size={20} className="mr-3 text-blue-600" />
                <span>Relatórios</span>
              </div>
              <ChevronDown
                size={16}
                className={cn("transition-transform duration-200", openMenus.relatorios ? "rotate-180" : "")}
              />
            </button>
            <div
              className={cn(
                "mt-1 space-y-1 pl-10 transition-all duration-200",
                openMenus.relatorios ? "block" : "hidden",
              )}
            >
              <MenuItemButton
                text="Horas Extras"
                active={activePage === "relatorios-horas"}
                onClick={() => onPageChange("relatorios-horas")}
              />
              <MenuItemButton
                text="Histórico de Registros"
                active={activePage === "relatorios-historico"}
                onClick={() => onPageChange("relatorios-historico")}
              />
            </div>
          </div>

          {/* Configurações */}
          <div className="mt-2">
            <button
              onClick={() => toggleMenu("configurations")}
              className="flex w-full items-center justify-between rounded-md px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-blue-50"
            >
              <div className="flex items-center">
                <Settings size={20} className="mr-3 text-blue-600" />
                <span>Configurações</span>
              </div>
              <ChevronDown
                size={16}
                className={cn("transition-transform duration-200", openMenus.configurations ? "rotate-180" : "")}
              />
            </button>
            <div
              className={cn(
                "mt-1 space-y-1 pl-10 transition-all duration-200",
                openMenus.configurations ? "block" : "hidden",
              )}
            >
              {/*<MenuItemButton
                text="Localização"
                active={activePage === "configuracoes-localizacao"}
                onClick={() => onPageChange("configuracoes-localizacao")}
              />*/}
            </div>
          </div>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-blue-100 p-4">
          <UserProfileMenu nome={"avatar"} email={""} />
        </div>
      </div>
    </>
  )
}
