// lib/logoutService.ts
export function logout() {
    // Remove token salvo (pode ser localStorage ou cookies)
    localStorage.removeItem("token")
  
    // Redireciona para a tela de login
    window.location.href = "/login"
  }
  