"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CadastrarEnderecoService } from "../service/CadastroEnderecoService";
import { useRouter } from "next/navigation"

export default function EnderecoPage() {
  const [logradouro, setLogradouro] = useState("")
  const [numero, setNumero] = useState("")
  const [complemento, setComplemento] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [uf, setUf] = useState("")
  const [cep, setCep] = useState("")

  const router = useRouter() // Para redirecionamento
  const cadastrarEnderecoService = useMemo(() => new CadastrarEnderecoService(), [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // POST usando o serviço
    cadastrarEnderecoService
      .cadastrarEndereco(logradouro, numero, complemento, bairro, cidade, uf, cep)
      .then((response) => {
        console.log("✅ Endereço cadastrado com sucesso:", response.data)

        // Redireciona para a página "home" após sucesso
        router.push("/home")
      })
      .catch((error) => {
        console.error("❌ Erro ao cadastrar o endereço:", error)
      })
  }

  // Função para formatar o CEP
  const formatarCEP = (valor: string) => {
    // Remove caracteres não numéricos
    const apenasNumeros = valor.replace(/\D/g, "")

    // Limita a 8 dígitos
    const cepLimitado = apenasNumeros.slice(0, 8)

    // Formata como 00000-000
    if (cepLimitado.length <= 5) {
      return cepLimitado
    } else {
      return `${cepLimitado.slice(0, 5)}-${cepLimitado.slice(5)}`
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Cadastro de Endereço</h1>

      {/* Formulário de Cadastro de Endereço */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Endereço</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campos de Logradouro e Número */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input
                  id="logradouro"
                  placeholder="Av. Brasil"
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  placeholder="123"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Campos de Complemento e Bairro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  placeholder="Apto 101"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  placeholder="Centro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Campos de Cidade, UF e CEP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  placeholder="São Paulo"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uf">UF</Label>
                <Select value={uf} onValueChange={setUf} required>
                  <SelectTrigger id="uf">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC">AC</SelectItem>
                    <SelectItem value="AL">AL</SelectItem>
                    <SelectItem value="AP">AP</SelectItem>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="BA">BA</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                    <SelectItem value="DF">DF</SelectItem>
                    <SelectItem value="ES">ES</SelectItem>
                    <SelectItem value="GO">GO</SelectItem>
                    <SelectItem value="MA">MA</SelectItem>
                    <SelectItem value="MT">MT</SelectItem>
                    <SelectItem value="MS">MS</SelectItem>
                    <SelectItem value="MG">MG</SelectItem>
                    <SelectItem value="PA">PA</SelectItem>
                    <SelectItem value="PB">PB</SelectItem>
                    <SelectItem value="PR">PR</SelectItem>
                    <SelectItem value="PE">PE</SelectItem>
                    <SelectItem value="PI">PI</SelectItem>
                    <SelectItem value="RJ">RJ</SelectItem>
                    <SelectItem value="RN">RN</SelectItem>
                    <SelectItem value="RS">RS</SelectItem>
                    <SelectItem value="RO">RO</SelectItem>
                    <SelectItem value="RR">RR</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="SP">SP</SelectItem>
                    <SelectItem value="SE">SE</SelectItem>
                    <SelectItem value="TO">TO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => setCep(formatarCEP(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
