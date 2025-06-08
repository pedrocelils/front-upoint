"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function CadastroEmpresa() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex justify-end space-x-4 pt-4 border-t border-blue-100">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            Cancelar
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastro incompleto</DialogTitle>
            <p className="text-sm text-gray-500">Deseja realmente sair sem salvar?</p>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Voltar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                setOpen(false)           // Fecha o modal
                router.push("/dashboard") // Navega para a Dashboard
              }}
            >
              Sair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
        Salvar
      </Button>
    </div>
  )
}
