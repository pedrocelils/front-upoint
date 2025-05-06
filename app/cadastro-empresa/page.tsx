"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Building2 } from "lucide-react"
import { CadastrarEmpresaService } from "../service/CadastroEmpresaService"

export default function EmpresaPage() {
  // Empresa
  const [razaoSocial, setRazaoSocial] = useState("")
  const [nomeFantasia, setNomeFantasia] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")

  // Endereço
  const [logradouro, setLogradouro] = useState("")
  const [numero, setNumero] = useState("")
  const [complemento, setComplemento] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [uf, setUf] = useState("")
  const [cep, setCep] = useState("")

  const router = useRouter()
  const [open, setOpen] = useState(false)
  const cadastrarEmpresaService = useMemo(() => new CadastrarEmpresaService(), [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const empresaData = { razaoSocial, nomeFantasia, cnpj, email, telefone }
    const enderecoData = { logradouro, numero, complemento, bairro, cidade, uf, cep }

    cadastrarEmpresaService
      .cadastrarEmpresaCompleta(empresaData, enderecoData)
      .then((response) => {
        console.log("✅ Empresa cadastrada com sucesso:", response.data)
        router.push("/home")
      })
      .catch((error) => {
        console.error("❌ Erro ao cadastrar a empresa:", error)
      })
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <Building2 size={20} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Cadastro de Empresa</h1>
      </div>

      <Card className="border border-blue-100 shadow-sm">
        <CardHeader className="bg-white border-b border-blue-100">
          <CardTitle className="text-gray-800">Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados da Empresa */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-blue-100">
                <h3 className="text-gray-700 font-medium text-base">Informações Gerais</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="razaoSocial">Razão Social</Label>
                  <Input id="razaoSocial" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                  <Input id="nomeFantasia" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-blue-100">
                <h3 className="text-gray-700 font-medium text-base">Endereço</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" value={cep} onChange={(e) => setCep(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input id="logradouro" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Input id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input id="complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="uf">UF</Label>
                  <Input id="uf" value={uf} onChange={(e) => setUf(e.target.value)} required maxLength={2} />
                </div>
              </div>
            </div>

            {/* Botões com Modal */}
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
                      onClick={() => router.push("/home")}
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
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
