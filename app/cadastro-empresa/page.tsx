"use client"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Building2, Search, AlertCircle } from "lucide-react"
import { CadastrarEmpresaService } from "../service/CadastroEmpresaService"

// Schema de validação com Zod
const empresaSchema = z.object({
  // Dados da empresa
  razaoSocial: z
    .string()
    .min(2, "Razão social deve ter pelo menos 2 caracteres")
    .max(100, "Razão social deve ter no máximo 100 caracteres"),

  nomeFantasia: z
    .string()
    .min(2, "Nome fantasia deve ter pelo menos 2 caracteres")
    .max(100, "Nome fantasia deve ter no máximo 100 caracteres"),

  cnpj: z
    .string()
    .min(14, "CNPJ deve ter 14 dígitos")
    .max(18, "CNPJ inválido")
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, "Formato de CNPJ inválido"),

  email: z.string().email("Email inválido").min(5, "Email deve ter pelo menos 5 caracteres"),

  telefone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 8 ígitos")
    .max(15, "Telefone deve ter no máximo 15 dígitos"),

  // Dados do endereço
  cep: z
    .string()
    .min(8, "CEP deve ter 8 dígitos")
    .max(9, "CEP inválido")
    .regex(/^\d{5}-?\d{3}$/, "Formato de CEP inválido"),

  logradouro: z
    .string()
    .min(5, "Logradouro deve ter pelo menos 5 caracteres")
    .max(100, "Logradouro deve ter no máximo 100 caracteres"),

  numero: z.string().min(1, "Número é obrigatório").max(10, "Número deve ter no máximo 10 caracteres"),

  complemento: z.string().max(50, "Complemento deve ter no máximo 50 caracteres").optional(),

  bairro: z
    .string()
    .min(2, "Bairro deve ter pelo menos 2 caracteres")
    .max(50, "Bairro deve ter no máximo 50 caracteres"),

  cidade: z
    .string()
    .min(2, "Cidade deve ter pelo menos 2 caracteres")
    .max(50, "Cidade deve ter no máximo 50 caracteres"),

  uf: z
    .string()
    .length(2, "UF deve ter exatamente 2 caracteres")
    .regex(/^[A-Z]{2}$/, "UF deve conter apenas letras maiúsculas"),

  latitude: z
    .number(),

  longitude: z
    .number(),

})

type EmpresaFormData = z.infer<typeof empresaSchema>

export default function EmpresaPage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const cadastrarEmpresaService = useMemo(() => new CadastrarEmpresaService(), [])

  //const [latitude, setLatitude] = useState<number | undefined>()
  //const [longitude, setLongitude] = useState<number | undefined>()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
    mode: "onChange", // Validação em tempo real
    defaultValues: {
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      email: "",
      telefone: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      latitude: undefined,
      longitude: undefined
    },
  })

  // Função para formatar CNPJ
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    }
    return value
  }

  // Função para formatar CEP
  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, "$1-$2")
    }
    return value
  }

  // Função para formatar telefone
  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
      } else {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      }
    }
    return value
  }

  const onSubmit = async (data: EmpresaFormData) => {
    setIsSubmitting(true)

    try {
      const empresaData = {
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        cnpj: data.cnpj.replace(/\D/g, ""), // Remove formatação
        email: data.email,
        telefone: data.telefone.replace(/\D/g, ""), // Remove formatação
      }

      const localizacaoData = {
        latitude: data.latitude,
        longitude: data.longitude
      }

      const enderecoData = {
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento || "",
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf.toUpperCase(),
        cep: data.cep.replace(/\D/g, ""), // Remove formatação
      }

      const response = await cadastrarEmpresaService.cadastrarEmpresaCompleta(empresaData, enderecoData, localizacaoData)

      console.log("✅ Empresa cadastrada com sucesso:", response.data)
      reset() // Limpa o formulário
      router.push("/dashboard")
    } catch (error) {
      console.error("❌ Erro ao cadastrar a empresa:", error)
      // Aqui você pode adicionar um toast de erro
    } finally {
      setIsSubmitting(false)
    }
  }

  /*const handleCancel = () => {
    if (isDirty) {
      setOpen(true)
    } else {
      router.push("/dashboard")
    }
  }

  const handleConfirmCancel = () => {
    reset()
    setOpen(false)
    router.push("/dashboard")
  }*/



  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Building2 size={20} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Cadastro de Empresa</h1>
        </div>

        {/* Barra de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" size={18} />
          <Input
            className="pl-10 w-full md:w-96 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white shadow-sm"
            placeholder="Buscar empresa por razão social, CNPJ ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="border border-blue-100 shadow-sm">
        <CardHeader className="bg-white border-b border-blue-100">
          <CardTitle className="text-gray-800">Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Dados da Empresa */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-blue-100">
                <h3 className="text-gray-700 font-medium text-base">Informações Gerais</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="razaoSocial" className="text-gray-700 mb-1.5 block">
                    Razão Social *
                  </Label>
                  <Input
                    id="razaoSocial"
                    {...register("razaoSocial")}
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.razaoSocial ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.razaoSocial && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.razaoSocial.message}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="nomeFantasia" className="text-gray-700 mb-1.5 block">
                    Nome Fantasia *
                  </Label>
                  <Input
                    id="nomeFantasia"
                    {...register("nomeFantasia")}
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.nomeFantasia ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.nomeFantasia && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.nomeFantasia.message}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cnpj" className="text-gray-700 mb-1.5 block">
                    CNPJ *
                  </Label>
                  <Input
                    id="cnpj"
                    {...register("cnpj")}
                    placeholder="00.000.000/0000-00"
                    onChange={(e) => {
                      const formatted = formatCNPJ(e.target.value)
                      e.target.value = formatted
                    }}
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.cnpj ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.cnpj && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.cnpj.message}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 mb-1.5 block">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="empresa@exemplo.com"
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.email.message}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="telefone" className="text-gray-700 mb-1.5 block">
                    Telefone *
                  </Label>
                  <Input
                    id="telefone"
                    {...register("telefone")}
                    placeholder="(11) 99999-9999"
                    onChange={(e) => {
                      const formatted = formatTelefone(e.target.value)
                      e.target.value = formatted
                    }}
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.telefone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.telefone && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.telefone.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-blue-100">
                <h3 className="text-gray-700 font-medium text-base">Endereço</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cep" className="text-gray-700 mb-1.5 block">
                    CEP *
                  </Label>
                  <Input
                    id="cep"
                    {...register("cep")}
                    placeholder="00000-000"
                    onChange={(e) => {
                      const formatted = formatCEP(e.target.value)
                      e.target.value = formatted
                    }}
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.cep ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.cep && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.cep.message}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="logradouro" className="text-gray-700 mb-1.5 block">
                    Logradouro *
                  </Label>
                  <Input
                    id="logradouro"
                    {...register("logradouro")}
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.logradouro ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.logradouro && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.logradouro.message}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numero" className="text-gray-700 mb-1.5 block">
                    Número *
                  </Label>
                  <Input
                    id="numero"
                    {...register("numero")}
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.numero ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.numero && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.numero.message}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="complemento" className="text-gray-700 mb-1.5 block">
                    Complemento
                  </Label>
                  <Input
                    id="complemento"
                    {...register("complemento")}
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.complemento ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.complemento && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.complemento.message}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="bairro" className="text-gray-700 mb-1.5 block">
                    Bairro *
                  </Label>
                  <Input
                    id="bairro"
                    {...register("bairro")}
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.bairro ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.bairro && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.bairro.message}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cidade" className="text-gray-700 mb-1.5 block">
                    Cidade *
                  </Label>
                  <Input
                    id="cidade"
                    {...register("cidade")}
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.cidade ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.cidade && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.cidade.message}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="uf" className="text-gray-700 mb-1.5 block">
                    UF *
                  </Label>
                  <Input
                    id="uf"
                    {...register("uf")}
                    placeholder="SP"
                    maxLength={2}
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase()
                    }}
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.uf ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.uf && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.uf.message}</span>
                    </div>
                  )}
                </div>
              </div>

               <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude" className="text-gray-700 mb-1.5 block">
                  Latitude *
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  {...register("latitude", { valueAsNumber: true })}
                  className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                    errors.latitude ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  disabled={isSubmitting}
                />
                {errors.latitude && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle size={14} className="text-red-500" />
                    <span className="text-sm text-red-500">{errors.latitude.message}</span>
                  </div>
                )}
              </div>

                <div>
                  <Label htmlFor="longitude" className="text-gray-700 mb-1.5 block">
                    Longitude *
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    {...register("longitude", { valueAsNumber: true })}
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.longitude ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.longitude && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.longitude.message}</span>
                    </div>
                  )}
                </div>

              </div>
              
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-blue-100">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isSubmitting}
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
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      Sair
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}