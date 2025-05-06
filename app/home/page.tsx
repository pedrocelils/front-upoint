"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronDown, Home, Users, FileText, Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {logout} from "../service/logoutService";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"




export default function HomeScreen() {
  const [totalFuncionarios, setTotalFuncionarios] = useState<number>(0)
  const [totalRegistros, setTotalRegistross] = useState<number>(0)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    cadastro: false,
    relatorios: false,
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  useEffect(() => {
    // Substitua a URL abaixo pela sua URL real da API
    fetch("https://upoint-deploy-jpa-production.up.railway.app/auth/funcionarios/count")
      .then((res) => res.json())
      .then((data) => setTotalFuncionarios(data.total))
      .catch((err) => console.error("Erro ao buscar total de funcionários:", err))
  }, [])

  useEffect(() => {
    // Substitua a URL abaixo pela sua URL real da API
    fetch("https://upoint-deploy-jpa-production.up.railway.app/registros/count")
      .then((res) => res.json())
      .then((data) => setTotalRegistross(data.total))
      .catch((err) => console.error("Erro ao buscar total de funcionários:", err))
  }, [])


  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
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

        <nav className="mt-5 px-2">
          <MenuItem href="/home" icon={<Home size={20} />} text="Home" active={true} />

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
              <MenuItem href="/cadastro-funcionario" text="Funcionário" />
              <MenuItem href="/cadastro-empresa" text="Empresa" />
              {/*<MenuItem href="/cadastro-endereco" text="Endereço" />*/}
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
              <MenuItem href="/relatorios/horas-extras" text="Horas Extras" />
              <MenuItem href="/relatorios/historico" text="Histórico de Registros" />
            </div>
          </div>

          {/* Configurações */}
          <div className="mt-2">
            <MenuItem href="/configuracoes" icon={<Settings size={20} />} text="Configurações" />
          </div>
        </nav>

        {/* User profile at bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-blue-100 p-4">
        <div className="flex items-center justify-between">
        <div className="absolute bottom-0 left-0 right-0 border-t border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserProfileMenu />
              <div>
                <p className="text-sm font-medium">Upoint</p>
                <p className="text-xs text-gray-500">usuario@upoint.com</p>
              </div>
            </div>
          </div>
        </div>


          <button
            onClick={logout}
            className="text-sm text-blue-600 hover:underline"
          >
            Sair
          </button>
        </div>
      </div>

      </div>

     
      {/* Main content */}
      <div className={cn("flex-1 transition-all duration-300", sidebarOpen ? "lg:ml-64" : "ml-0")}>
        <header className="bg-white h-16 shadow-sm flex items-center px-6 border-b border-blue-100">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        </header>
        <main className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <DashboardCard
              title="Total de Funcionários"
              value={totalFuncionarios.toString()}
              icon={<Users size={24} className="text-blue-600" />}
            />
            <DashboardCard title="Total de Registros" value={totalRegistros.toString()} icon={<FileText size={24} className="text-blue-600" />} />
            <DashboardCard title="Horas Extras" value="32h" icon={<Clock size={24} className="text-blue-600" />} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-100">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Bem-vindo ao Sistema de Gestão</h3>
            <p className="text-gray-600">Selecione uma opção no menu lateral para começar a utilizar o sistema.</p>
            <div className="mt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Ver Relatórios</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Helper component for menu items
function MenuItem({
  href,
  icon,
  text,
  active = false,
}: {
  href: string
  icon?: React.ReactNode
  text: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-50",
        active ? "bg-blue-50 text-blue-600" : "text-gray-700",
      )}
    >
      {icon && <span className={cn("mr-3", active ? "text-blue-600" : "text-gray-500")}>{icon}</span>}
      {text}
    </Link>
  )
}

// Dashboard card component
function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">{icon}</div>
      </div>
    </div>
  )
}

// Clock icon component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Clock(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

 function UserProfileMenu() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
          U
        </button>
      </DialogTrigger>

      <DialogContent className="w-64 p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Usuário</p>
            <p className="text-xs text-gray-500">usuario@nopy.com</p>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => alert("Funcionalidade de perfil em breve")}
            >
              Perfil
            </Button>

            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

