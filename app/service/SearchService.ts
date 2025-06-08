export async function buscarFuncionarios(query: string) {
  const res = await fetch(`/auth/busca?search=${encodeURIComponent(query)}`);

  if (!res.ok) {
    throw new Error('Erro ao buscar funcionários');
  }

  return res.json();
}
