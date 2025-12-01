import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

/**
 * Verifica se o usuário está autenticado
 * Verifica tanto access_token quanto authorization_code (para testes locais)
 */
export const isAuthenticated = (): boolean => {
  // Verifica se tem access_token (produção)
  const accessToken = localStorage.getItem('bling_access_token')
  const expiresAt = localStorage.getItem('bling_token_expires_at')
  
  if (accessToken && expiresAt) {
    // Verifica se o token ainda não expirou
    const expirationTime = parseInt(expiresAt, 10)
    const now = Date.now()
    
    if (now >= expirationTime) {
      // Token expirado, limpa o localStorage
      localStorage.removeItem('bling_access_token')
      localStorage.removeItem('bling_refresh_token')
      localStorage.removeItem('bling_token_expires_at')
      localStorage.removeItem('bling_token_expires_in')
      localStorage.removeItem('bling_token_scope')
      return false
    }
    
    return true
  }
  
  // Verifica se tem authorization_code (testes locais)
  const authorizationCode = localStorage.getItem('bling_authorization_code')
  if (authorizationCode) {
    return true
  }
  
  return false
}

/**
 * Guard de navegação para rotas autenticadas
 */
export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (isAuthenticated()) {
    next()
  } else {
    // Redireciona para login se não estiver autenticado
    next({ name: 'Login', query: { redirect: to.fullPath } })
  }
}

