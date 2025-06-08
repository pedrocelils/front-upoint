"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { UserPlus, AlertCircle, AlertTriangle } from "lucide-react"
import { cadastrarFuncionario, listarEmpresas, type Empresa } from "../service/BuscarEmpresaService"
import { toast } from "sonner"

// Schema de validação com Zod
const funcionarioSchema = z.object({
  // Dados de login
  login: z
    .string()
    .min(3, "Login deve ter pelo menos 3 caracteres")
    .max(20, "Login deve ter no máximo 20 caracteres")
    .regex(/^[a-zA-Z-_]+$/, "Login deve conter apenas letras"),

  senha: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(50, "Senha deve ter no máximo 50 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula e 1 número"),

  // Dados pessoais
  role: z.enum(["ADMIN", "USER"], {
    errorMap: () => ({ message: "Selecione um perfil válido" }),
  }),

  cpf: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF inválido")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, "Formato de CPF inválido"),

  email: z.string().email("Email inválido").min(5, "Email deve ter pelo menos 5 caracteres"),

  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

  telefone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .max(15, "Telefone deve ter no máximo 15 dígitos")
    .regex(/^[\d\s()+-]+$/, "Formato de telefone inválido"),

  // Dados profissionais
  cargo: z.string().min(2, "Cargo deve ter pelo menos 2 caracteres").max(50, "Cargo deve ter no máximo 50 caracteres"),

  departamento: z
    .string()
    .min(2, "Departamento deve ter pelo menos 2 caracteres")
    .max(50, "Departamento deve ter no máximo 50 caracteres"),

  empresaId: z.string().min(1, "Selecione uma empresa"),

  // Dados de endereço
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

  estado: z
    .string()
    .length(2, "Estado deve ter exatamente 2 caracteres")
    .regex(/^[A-Z]{2}$/, "Estado deve conter apenas letras maiúsculas"),
})

type FuncionarioFormData = z.infer<typeof funcionarioSchema>

// Interface para erros específicos do backend
interface BackendError {
  field?: string
  message: string
  type: "validation" | "conflict" | "server" | "network"
}

export default function FuncionarioPage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [backendErrors, setBackendErrors] = useState<BackendError[]>([])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
    reset,
    setError,
    clearErrors,
  } = useForm<FuncionarioFormData>({
    resolver: zodResolver(funcionarioSchema),
    mode: "onChange",
    defaultValues: {
      login: "",
      senha: "",
      role: "USER",
      cpf: "",
      email: "",
      nome: "",
      telefone: "",
      cargo: "",
      departamento: "",
      empresaId: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  })

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const data = await listarEmpresas()
        setEmpresas(data)
        console.log("✅ Empresas carregadas:", data.length)
      } catch (error) {
        console.error("❌ Erro ao buscar empresas:", error)
        toast.error("Erro ao carregar empresas", {
          description: "Não foi possível carregar a lista de empresas",
        })
      }
    }
    fetchEmpresas()
  }, [])

  // Função para processar erros do backend
  const processBackendError = (error: any): BackendError[] => {
    console.log("🔍 Processando erro do backend:", error)

    const errors: BackendError[] = []

    // Verificar se é um erro de resposta HTTP
    if (error.response) {
      const { status, data } = error.response
      console.log(`📥 Status: ${status}, Data:`, data)

      switch (status) {
        case 400:
          // Erro de validação ou conflito
          if (typeof data === "string") {
            // Verificar tipos específicos de erro
            if (data.includes("login")) {
              errors.push({
                field: "login",
                message: data,
                type: "conflict",
              })
            } else if (data.includes("CPF")) {
              errors.push({
                field: "cpf",
                message: data,
                type: "conflict",
              })
            } else if (data.includes("email")) {
              errors.push({
                field: "email",
                message: data,
                type: "conflict",
              })
            } else {
              errors.push({
                message: data,
                type: "validation",
              })
            }
          } else if (data.errors && Array.isArray(data.errors)) {
            // Erros de validação estruturados
            data.errors.forEach((err: any) => {
              errors.push({
                field: err.field,
                message: err.message,
                type: "validation",
              })
            })
          } else {
            errors.push({
              message: data.message || "Dados inválidos",
              type: "validation",
            })
          }
          break

        case 409:
          // Conflito - recurso já existe
          errors.push({
            message: data.message || data || "Recurso já existe",
            type: "conflict",
          })
          break

        case 500:
          errors.push({
            message: "Erro interno do servidor. Tente novamente mais tarde.",
            type: "server",
          })
          break

        default:
          errors.push({
            message: `Erro ${status}: ${data.message || data || "Erro desconhecido"}`,
            type: "server",
          })
      }
    } else if (error.request) {
      // Erro de rede
      errors.push({
        message: "Erro de conexão. Verifique sua internet e tente novamente.",
        type: "network",
      })
    } else {
      // Erro genérico
      errors.push({
        message: error.message || "Erro inesperado",
        type: "server",
      })
    }

    return errors
  }

  // Função para aplicar erros nos campos do formulário
  const applyFieldErrors = (backendErrors: BackendError[]) => {
    backendErrors.forEach((error) => {
      if (error.field) {
        setError(error.field as keyof FuncionarioFormData, {
          type: "manual",
          message: error.message,
        })
      }
    })
  }

  // Função para mostrar toast baseado no tipo de erro
  const showErrorToast = (backendErrors: BackendError[]) => {
    const conflictErrors = backendErrors.filter((e) => e.type === "conflict")
    const validationErrors = backendErrors.filter((e) => e.type === "validation")
    const serverErrors = backendErrors.filter((e) => e.type === "server")
    const networkErrors = backendErrors.filter((e) => e.type === "network")

    if (conflictErrors.length > 0) {
      toast.error("❌ Dados já cadastrados", {
        description: conflictErrors.map((e) => e.message).join(", "),
        duration: 6000,
      })
    } else if (validationErrors.length > 0) {
      toast.error("⚠️ Dados inválidos", {
        description: "Verifique os campos destacados e tente novamente",
        duration: 5000,
      })
    } else if (networkErrors.length > 0) {
      toast.error("🌐 Erro de conexão", {
        description: networkErrors[0].message,
        duration: 5000,
      })
    } else if (serverErrors.length > 0) {
      toast.error("🔧 Erro do servidor", {
        description: serverErrors[0].message,
        duration: 5000,
      })
    }
  }

  // Funções de formatação
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
    return value
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, "$1-$2")
    }
    return value
  }

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

  const onSubmit = async (data: FuncionarioFormData) => {
    setIsSubmitting(true)
    setBackendErrors([])
    clearErrors() // Limpar erros anteriores

    // Toast de loading
    const loadingToast = toast.loading("Cadastrando funcionário...", {
      description: "Processando dados do funcionário",
    })

    try {
      // Garantir que complemento seja sempre uma string
      const formattedData = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ""), // Remove formatação
        telefone: data.telefone.replace(/\D/g, ""), // Remove formatação
        cep: data.cep.replace(/\D/g, ""), // Remove formatação
        estado: data.estado.toUpperCase(),
        complemento: data.complemento || "", // Converte undefined para string vazia
      }

      console.log("📤 Dados formatados para envio:", formattedData)

      await cadastrarFuncionario(formattedData)

      console.log("✅ Funcionário cadastrado com sucesso")

      // Dismiss loading toast e mostrar sucesso
      toast.dismiss(loadingToast)
      toast.success("✅ Funcionário cadastrado com sucesso!", {
        description: `${data.nome} foi adicionado ao sistema`,
        action: {
          label: "Ver Dashboard",
          onClick: () => router.push("/"),
        },
        duration: 5000,
      })

      reset()
      router.push("/dashboard")
    } catch (error: any) {
      console.error("❌ Erro ao cadastrar funcionário:", error)

      // Processar erros do backend
      const processedErrors = processBackendError(error)
      setBackendErrors(processedErrors)

      // Aplicar erros nos campos específicos
      applyFieldErrors(processedErrors)

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      // Mostrar toast de erro apropriado
      showErrorToast(processedErrors)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (isDirty) {
      setOpen(true)
    } else {
      router.push("/")
    }
  }

  const handleConfirmCancel = () => {
    reset()
    setOpen(false)
    router.push("/")
  }

  // Função para verificar se um campo tem erro do backend
  const hasBackendError = (fieldName: string) => {
    return backendErrors.some((error) => error.field === fieldName)
  }

  // Função para obter mensagem de erro do backend para um campo
  const getBackendError = (fieldName: string) => {
    const error = backendErrors.find((error) => error.field === fieldName)
    return error?.message
  }

  const estados = [
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
  ]

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <UserPlus size={20} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Cadastro de Funcionário</h1>
        </div>
      </div>

      {/* Alerta de erros gerais do backend */}
      {backendErrors.some((e) => !e.field) && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Erro no cadastro</h3>
                <div className="mt-1 text-sm text-red-700">
                  {backendErrors
                    .filter((e) => !e.field)
                    .map((error, index) => (
                      <p key={index}>{error.message}</p>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border border-blue-100 shadow-sm">
        <CardHeader className="bg-white border-b border-blue-100">
          <CardTitle className="text-gray-800">Dados do Funcionário</CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Login / Senha */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-blue-100">
                <h3 className="text-gray-700 font-medium text-base">Dados de Acesso</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="login" className="text-gray-700 mb-1.5 block">
                    Login *
                  </Label>
                  <Input
                    id="login"
                    {...register("login")}
                    placeholder="usuario123"
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.login || hasBackendError("login")
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {(errors.login || hasBackendError("login")) && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.login?.message || getBackendError("login")}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="senha" className="text-gray-700 mb-1.5 block">
                    Senha *
                  </Label>
                  <Input
                    id="senha"
                    type="password"
                    {...register("senha")}
                    placeholder="Mínimo 6 caracteres"
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.senha ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.senha && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.senha.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dados Pessoais */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-blue-100">
                <h3 className="text-gray-700 font-medium text-base">Dados Pessoais</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="role" className="text-gray-700 mb-1.5 block">
                    Perfil *
                  </Label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                        <SelectTrigger
                          className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                            errors.role ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Selecione o perfil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                          <SelectItem value="USER">USER</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.role.message}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="cpf" className="text-gray-700 mb-1.5 block">
                    CPF *
                  </Label>
                  <Input
                    id="cpf"
                    {...register("cpf")}
                    placeholder="000.000.000-00"
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value)
                      e.target.value = formatted
                    }}
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.cpf || hasBackendError("cpf")
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {(errors.cpf || hasBackendError("cpf")) && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.cpf?.message || getBackendError("cpf")}</span>
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
                    placeholder="usuario@exemplo.com"
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.email || hasBackendError("email")
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {(errors.email || hasBackendError("email")) && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.email?.message || getBackendError("email")}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome" className="text-gray-700 mb-1.5 block">
                    Nome Completo *
                  </Label>
                  <Input
                    id="nome"
                    {...register("nome")}
                    placeholder="João Silva Santos"
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.nome ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.nome && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.nome.message}</span>
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

            {/* Dados Profissionais */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-blue-100">
                <h3 className="text-gray-700 font-medium text-base">Dados Profissionais</h3>
              </div>
              <div>
                <Label htmlFor="empresaId" className="text-gray-700 mb-1.5 block">
                  Empresa *
                </Label>
                <Controller
                  name="empresaId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                      <SelectTrigger
                        className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                          errors.empresaId ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                      >
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
                  )}
                />
                {errors.empresaId && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle size={14} className="text-red-500" />
                    <span className="text-sm text-red-500">{errors.empresaId.message}</span>
                  </div>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cargo" className="text-gray-700 mb-1.5 block">
                    Cargo *
                  </Label>
                  <Input
                    id="cargo"
                    {...register("cargo")}
                    placeholder="Desenvolvedor"
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.cargo ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.cargo && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.cargo.message}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="departamento" className="text-gray-700 mb-1.5 block">
                    Departamento *
                  </Label>
                  <Input
                    id="departamento"
                    {...register("departamento")}
                    placeholder="Tecnologia"
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      errors.departamento ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.departamento && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.departamento.message}</span>
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
                    placeholder="Rua das Flores"
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
                    placeholder="123"
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
                    placeholder="Apto 101"
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
                    placeholder="Centro"
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
                    placeholder="São Paulo"
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
                  <Label htmlFor="estado" className="text-gray-700 mb-1.5 block">
                    Estado *
                  </Label>
                  <Controller
                    name="estado"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                        <SelectTrigger
                          className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                            errors.estado ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {estados.map((uf) => (
                            <SelectItem key={uf} value={uf}>
                              {uf}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.estado && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-500">{errors.estado.message}</span>
                    </div>
                  )}
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
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Cancelar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastro incompleto</DialogTitle>
                    <p className="text-sm text-gray-500">
                      Você tem alterações não salvas. Deseja realmente sair sem salvar?
                    </p>
                  </DialogHeader>
                  <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Continuar editando
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirmCancel}>
                      Sair sem salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                disabled={isSubmitting}
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
