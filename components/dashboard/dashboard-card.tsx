import type React from "react"

interface DashboardCardProps {
  title: string
  value: string
  icon: React.ReactNode
}

export function DashboardCard({ title, value, icon }: DashboardCardProps) {
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
