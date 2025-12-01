import axios, { AxiosInstance, AxiosError } from 'axios'
import { getAccessToken, isTokenExpired } from './authService'

// Cria instância do axios para API do Bling
const createBlingApiClient = (): AxiosInstance => {
  return axios.create({
    baseURL: 'http://localhost',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-revision': '3.1.0'
    }
  })
}

/**
 * Obtém o access token e adiciona ao header de autorização
 */
const getAuthHeaders = (): { Authorization: string } | null => {
  const token = getAccessToken()
  
  if (!token) {
    return null
  }
  
  return {
    'Authorization': `Bearer ${token}`
  }
}

/**
 * Interceptor para adicionar token automaticamente
 */
const setupAuthInterceptor = (client: AxiosInstance): void => {
  client.interceptors.request.use(
    (config) => {
      const authHeaders = getAuthHeaders()
      
      if (authHeaders && config.headers) {
        config.headers.Authorization = authHeaders.Authorization
      }
      
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Token expirado ou inválido
        console.error('Token inválido ou expirado')
        // Opcional: limpar tokens e redirecionar para login
      }
      return Promise.reject(error)
    }
  )
}

/**
 * Cliente da API do Bling com autenticação automática
 */
const getBlingApiClient = (): AxiosInstance => {
  const client = createBlingApiClient()
  setupAuthInterceptor(client)
  return client
}

/**
 * Testa a conexão com a API do Bling
 * @returns Promise com a resposta da API
 */
export const testApiConnection = async (): Promise<{ success: boolean; message: string; data?: any }> => {
  // Verifica se há authorization_code mas não há access_token
  const authCode = localStorage.getItem('bling_authorization_code')
  const accessToken = localStorage.getItem('bling_access_token')
  
  if (authCode && !accessToken) {
    throw new Error('Authorization code encontrado, mas access token não. Por favor, clique em "Trocar Code por Token" primeiro.')
  }
  
  const token = getAccessToken()
  
  if (!token) {
    throw new Error('Token não encontrado. Por favor, faça login e troque o código por token.')
  }
  
  if (isTokenExpired()) {
    throw new Error('Token expirado. Por favor, renove o token.')
  }
  
  const client = getBlingApiClient()
  
  try {
    // Exemplo: busca lista de contatos
    const response = await client.get('/Api/v3/contatos')
    
    return {
      success: true,
      message: 'Conexão com a API bem-sucedida!',
      data: response.data
    }
  } catch (error) {
    const axiosError = error as AxiosError
    
    if (axiosError.response) {
      const status = axiosError.response.status
      const statusText = axiosError.response.statusText
      const errorData = axiosError.response.data as any
      
      // Tratamento especial para erro de escopo insuficiente
      if (errorData?.error?.type === 'insufficient_scope' || errorData?.type === 'insufficient_scope') {
        const scope = localStorage.getItem('bling_token_scope') || 'nenhum'
        return {
          success: false,
          message: `Permissões insuficientes. O token atual tem os escopos: "${scope}". Você precisa solicitar os escopos necessários na tela de login (ex: "contatos produtos pedidos").`,
          data: errorData
        }
      }
      
      return {
        success: false,
        message: `Erro na conexão: ${status} ${statusText}${errorData?.error ? ` - ${errorData.error.message || errorData.error}` : ''}${errorData?.description ? ` - ${errorData.description}` : ''}`,
        data: errorData
      }
    }
    
    return {
      success: false,
      message: 'Erro de conexão ao tentar acessar a API'
    }
  }
}

/**
 * Busca contatos da API do Bling
 */
export const getContatos = async (): Promise<any> => {
  const client = getBlingApiClient()
  const response = await client.get('/Api/v3/contatos')
  return response.data
}




