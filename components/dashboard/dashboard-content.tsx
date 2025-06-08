import { Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardCard } from "./dashboard-card"

interface DashboardContentProps {
  totalFuncionarios: number
  totalRegistros: number
}

export function DashboardContent({ totalFuncionarios, totalRegistros }: DashboardContentProps) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-6">
        <DashboardCard
          title="Total de Funcionários"
          value={totalFuncionarios.toString()}
          icon={<Users size={24} className="text-blue-600" />}
        />
        <DashboardCard
          title="Total de Registros"
          value={totalRegistros.toString()}
          icon={<FileText size={24} className="text-blue-600" />}
        />
        {/*<DashboardCard title="Horas Extras" value="32h" icon={<Clock size={24} className="text-blue-600" />} />*/}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-100">
        <h3 className="text-lg font-medium mb-4 text-gray-800">Bem-vindo ao Sistema de Gestão</h3>
        <p className="text-gray-600">Selecione uma opção no menu lateral para começar a utilizar o sistema.</p>
        <div className="mt-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Ver Relatórios</Button>
        </div>
      </div>
    </>
  )
}
