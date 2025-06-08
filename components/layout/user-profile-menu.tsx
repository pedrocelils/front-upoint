"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, LogOut, Settings, HelpCircle, Loader2 } from "lucide-react"
import { logout } from "../../app/service/logoutService"
import { toast } from "sonner"

interface UserProfileMenuProps {
  nome: string
  email: string
}

export function UserProfileMenu({ nome, email }: UserProfileMenuProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
      toast.success("Logout realizado com sucesso!", {
        description: "Você foi desconectado do sistema",
      })
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      toast.error("Erro ao fazer logout", {
        description: "Tente novamente em alguns instantes",
      })
    } finally {
      setIsLoggingOut(false)
      setShowLogoutDialog(false)
    }
  }

  const getInitials = (nome: string) => {
    if (!nome) return "?"
    return nome
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-600 text-white font-semibold">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                {getInitials(nome)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium text-sm">{nome}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">{email}</p>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() =>
              toast.info("Funcionalidade em desenvolvimento", {
                description: "A página de perfil estará disponível em breve",
              })
            }
          >
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() =>
              toast.info("Funcionalidade em desenvolvimento", {
                description: "As configurações estarão disponíveis em breve",
              })
            }
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() =>
              toast.info("Funcionalidade em desenvolvimento", {
                description: "A central de ajuda estará disponível em breve",
              })
            }
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Ajuda</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-red-600" />
              Confirmar Logout
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja sair do sistema? Você precisará fazer login novamente para acessar sua conta.
            </p>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)} disabled={isLoggingOut}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut} className="gap-2">
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saindo...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Sair
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
