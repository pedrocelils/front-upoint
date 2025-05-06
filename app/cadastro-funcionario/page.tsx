/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, UserPlus } from "lucide-react"
import { cadastrarFuncionario, listarEmpresas, type Empresa } from "../service/BuscarEmpresaService"
import { useRouter } from "next/navigation"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function FuncionarioPage() {
  const [form, setForm] = useState<{
    login: string
    senha: string
    role: string
    cpf: string
    email: string
    nome: string
    telefone: string
    empresaId: string
    cep: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
  }>({
    login: "",
    senha: "",
    role: "USER",
    cpf: "",
    email: "",
    nome: "",
    telefone: "",
    empresaId: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  })
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [searchQuery, setSearchQuery] = useState("")

    const router = useRouter()
    const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const data = await listarEmpresas()
        setEmpresas(data)
      } catch (error) {
        console.error("Erro ao buscar empresas", error)
      }
    }
    fetchEmpresas()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await cadastrarFuncionario(form)
      alert("Funcionário cadastrado com sucesso")
      setForm({
        login: "",
        senha: "",
        role: "USER",
        cpf: "",
        email: "",
        nome: "",
        telefone: "",
        empresaId: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
      })
    } catch (error) {
      console.error("Erro ao cadastrar funcionário", error)
      alert("Erro ao cadastrar funcionário")
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <UserPlus size={20} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Cadastro de Funcionário</h1>
        </div>

        {/* Barra de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" size={18} />
          <Input
            className="pl-10 w-full md:w-96 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white shadow-sm"
            placeholder="Buscar funcionário por nome, CPF ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="border border-blue-100 shadow-sm">
        <CardHeader className="bg-white border-b border-blue-100">
          <CardTitle className="text-gray-800">Dados do Funcionário</CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login / Senha */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="login" className="text-gray-700 mb-1.5 block">
                  Login
                </Label>
                <Input
                  id="login"
                  required
                  value={form.login}
                  onChange={handleChange}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="senha" className="text-gray-700 mb-1.5 block">
                  Senha
                </Label>
                <Input
                  id="senha"
                  type="password"
                  required
                  value={form.senha}
                  onChange={handleChange}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Role / CPF / Email */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="role" className="text-gray-700 mb-1.5 block">
                  Perfil
                </Label>
                <Select value={form.role} onValueChange={(val) => handleSelectChange("role", val)}>
                  <SelectTrigger id="role" className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="USER">USER</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cpf" className="text-gray-700 mb-1.5 block">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  required
                  value={form.cpf}
                  onChange={handleChange}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700 mb-1.5 block">
                  Email
                </Label>
                <Input
                  id="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Nome / Telefone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome" className="text-gray-700 mb-1.5 block">
                  Nome
                </Label>
                <Input
                  id="nome"
                  required
                  value={form.nome}
                  onChange={handleChange}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="telefone" className="text-gray-700 mb-1.5 block">
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  required
                  value={form.telefone}
                  onChange={handleChange}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Empresa */}
            <div>
              <Label htmlFor="empresaId" className="text-gray-700 mb-1.5 block">
                Empresa
              </Label>
              <Select value={form.empresaId} onValueChange={(val) => handleSelectChange("empresaId", val)}>
                <SelectTrigger id="empresaId" className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.nomeFantasia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-blue-100">
                <h3 className="text-gray-700 font-medium text-base">Endereço</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cep" className="text-gray-700 mb-1.5 block">
                    CEP
                  </Label>
                  <Input
                    id="cep"
                    value={form.cep}
                    onChange={handleChange}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="logradouro" className="text-gray-700 mb-1.5 block">
                    Logradouro
                  </Label>
                  <Input
                    id="logradouro"
                    value={form.logradouro}
                    onChange={handleChange}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numero" className="text-gray-700 mb-1.5 block">
                    Número
                  </Label>
                  <Input
                    id="numero"
                    value={form.numero}
                    onChange={handleChange}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="complemento" className="text-gray-700 mb-1.5 block">
                    Complemento
                  </Label>
                  <Input
                    id="complemento"
                    value={form.complemento}
                    onChange={handleChange}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="bairro" className="text-gray-700 mb-1.5 block">
                    Bairro
                  </Label>
                  <Input
                    id="bairro"
                    value={form.bairro}
                    onChange={handleChange}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cidade" className="text-gray-700 mb-1.5 block">
                    Cidade
                  </Label>
                  <Input
                    id="cidade"
                    value={form.cidade}
                    onChange={handleChange}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="estado" className="text-gray-700 mb-1.5 block">
                    Estado
                  </Label>
                  <Select value={form.estado} onValueChange={(val) => handleSelectChange("estado", val)}>
                    <SelectTrigger id="estado" className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "AC",
                        "AL",
                        "AP",
                        "AM",
                        "BA",
                        "CE",
                        "DF",
                        "ES",
                        "GO",
                        "MA",
                        "MT",
                        "MS",
                        "MG",
                        "PA",
                        "PB",
                        "PR",
                        "PE",
                        "PI",
                        "RJ",
                        "RN",
                        "RS",
                        "RO",
                        "RR",
                        "SC",
                        "SP",
                        "SE",
                        "TO",
                      ].map((uf) => (
                        <SelectItem key={uf} value={uf}>
                          {uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            

            {/* Ações */}
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
