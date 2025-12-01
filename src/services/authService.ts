import axios, { AxiosInstance, AxiosError } from 'axios'

// Interface para a resposta do token
export interface TokenResponse {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
  refresh_token: string
}

// Interface para as credenciais
interface Credentials {
  clientId: string
  clientSecret: string
}

// Cria instância do axios para OAuth
const createOAuthClient = (): AxiosInstance => {
  // Usa localhost se estiver em ambiente de teste, senão usa a API oficial
  const baseURL = 'http://localhost'; 

  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '1.0'
    }
  })
}

/**
 * Obtém as credenciais do localStorage
 */
const getCredentials = (): Credentials | null => {
  const clientId = localStorage.getItem('bling_client_id')
  const clientSecret = localStorage.getItem('bling_client_secret')
  
  if (!clientId || !clientSecret) {
    return null
  }
  
  return { clientId, clientSecret }
}

/**
 * Cria o header de autorização Basic Auth
 */
const createAuthHeader = (clientId: string, clientSecret: string): string => {
  const credentials = `${clientId}:${clientSecret}`
  return `Basic ${btoa(credentials)}`
}

/**
 * Troca o authorization_code por access_token
 * @param code - Authorization code recebido no callback
 * @param credentials - Credenciais opcionais (se não fornecidas, tenta buscar do localStorage)
 * @returns Promise com os tokens de acesso
 */
export const exchangeCodeForToken = async (
  code: string, 
  credentials?: { clientId: string; clientSecret: string }
): Promise<TokenResponse> => {
  // Se credenciais não foram fornecidas, tenta buscar do localStorage
  const creds = credentials || getCredentials()
  
  if (!creds) {
    throw new Error('Credenciais não encontradas. Por favor, forneça o Client ID e Client Secret.')
  }
  
  const client = createOAuthClient()
  
  try {
    const response = await client.post<TokenResponse>(
      '/Api/v3/oauth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code
      }),
      {
        headers: {
          'Authorization': createAuthHeader(creds.clientId, creds.clientSecret)
        }
      }
    )
    
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    
    if (axiosError.response) {
      const errorData = axiosError.response.data as any
      const status = axiosError.response.status
      const message = errorData?.error_description || errorData?.error || `Erro ${status} ao obter token`
      console.error('Erro na resposta do servidor:', {
        status,
        data: errorData,
        url: axiosError.config?.url
      })
      throw new Error(message)
    }
    
    // Erro de rede ou CORS
    console.error('Erro de conexão:', {
      message: axiosError.message,
      code: axiosError.code,
      url: axiosError.config?.url,
      baseURL: axiosError.config?.baseURL
    })
    
    const baseURL = 'http://localhost';
    throw new Error(`Erro de conexão ao tentar obter token. Verifique se o servidor está acessível em ${baseURL}/Api/v3/oauth/token`)
  }
}

/**
 * Atualiza o access_token usando o refresh_token
 * @param refreshToken - Refresh token para obter novo access token
 * @returns Promise com os novos tokens de acesso
 */
export const refreshAccessToken = async (
  refreshToken: string,
  credentials?: { clientId: string; clientSecret: string }
): Promise<TokenResponse> => {
  // Se credenciais não foram fornecidas, tenta buscar do localStorage
  const creds = credentials || getCredentials()
  
  if (!creds) {
    throw new Error('Credenciais não encontradas. Por favor, forneça o Client ID e Client Secret.')
  }
  
  const client = createOAuthClient()
  
  try {
    const response = await client.post<TokenResponse>(
      '/Api/v3/oauth/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }),
      {
        headers: {
          'Authorization': createAuthHeader(creds.clientId, creds.clientSecret)
        }
      }
    )
    
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    
    if (axiosError.response) {
      const errorData = axiosError.response.data as any
      throw new Error(errorData.error_description || errorData.error || 'Erro ao atualizar token')
    }
    
    throw new Error('Erro de conexão ao tentar atualizar token')
  }
}

/**
 * Salva os tokens no localStorage
 */
export const saveTokens = (tokenResponse: TokenResponse): void => {
  localStorage.setItem('bling_access_token', tokenResponse.access_token)
  localStorage.setItem('bling_refresh_token', tokenResponse.refresh_token)
  localStorage.setItem('bling_token_expires_in', String(tokenResponse.expires_in))
  localStorage.setItem('bling_token_scope', tokenResponse.scope)
  
  // Calcula o tempo de expiração
  const expiresAt = Date.now() + (tokenResponse.expires_in * 1000)
  localStorage.setItem('bling_token_expires_at', String(expiresAt))
  
  // Remove o authorization_code após trocar por token
  localStorage.removeItem('bling_authorization_code')
}

/**
 * Verifica se o token está expirado
 */
export const isTokenExpired = (): boolean => {
  const expiresAt = localStorage.getItem('bling_token_expires_at')
  
  if (!expiresAt) {
    return true
  }
  
  const expirationTime = parseInt(expiresAt, 10)
  return Date.now() >= expirationTime
}

/**
 * Obtém o access_token atual (ou null se não existir/expirado)
 */
export const getAccessToken = (): string | null => {
  if (isTokenExpired()) {
    return null
  }
  
  return localStorage.getItem('bling_access_token')
}

