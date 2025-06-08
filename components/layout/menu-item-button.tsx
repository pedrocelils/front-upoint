"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface MenuItemButtonProps {
  icon?: React.ReactNode
  text: string
  active?: boolean
  onClick: () => void
}

export function MenuItemButton({ icon, text, active = false, onClick }: MenuItemButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-50 w-full text-left",
        active ? "bg-blue-50 text-blue-600" : "text-gray-700",
      )}
    >
      {icon && <span className={cn("mr-3", active ? "text-blue-600" : "text-gray-500")}>{icon}</span>}
      {text}
    </button>
  )
}
