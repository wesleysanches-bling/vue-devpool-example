<template>
  <main class="dashboard-page">
    <div class="dashboard-header">
    <h1>Dashboard</h1>
      <button @click="handleLogout" class="btn-logout">Sair</button>
    </div>

    <div class="dashboard-content">
      <div class="info-card">
        <h2>Informações de Autenticação</h2>
        <div class="info-item">
          <strong>Status:</strong>
          <span class="status-badge" :class="{ active: authStatus }">
            {{ authStatus ? 'Autenticado' : 'Não autenticado' }}
          </span>
        </div>
        <div class="info-item" v-if="tokenInfo.authorizationCode">
          <strong>Authorization Code:</strong>
          <code class="token-preview">{{ codePreview }}</code>
        </div>
        <div class="info-item" v-if="tokenInfo.accessToken">
          <strong>Access Token:</strong>
          <code class="token-preview">{{ tokenPreview }}</code>
        </div>
        <div class="info-item" v-if="tokenInfo.expiresAt">
          <strong>Expira em:</strong>
          <span>{{ tokenExpiration }}</span>
        </div>
        <div class="info-item" v-if="tokenInfo.scope">
          <strong>Escopos:</strong>
          <span>{{ tokenInfo.scope }}</span>
        </div>
      </div>

      <div class="actions-card">
        <h2>Ações</h2>
        <div class="actions-grid">
          <button 
            v-if="tokenInfo.authorizationCode && !tokenInfo.accessToken" 
            class="action-btn action-btn-primary" 
            @click="exchangeCodeForTokenHandler"
            :disabled="isExchanging"
          >
            {{ isExchanging ? 'Trocando código...' : 'Trocar Code por Token' }}
          </button>
          <button class="action-btn" @click="refreshTokenInfo">
            Atualizar Informações
          </button>
          <button 
            class="action-btn" 
            @click="testApiConnection"
            :disabled="!hasAccessToken"
          >
            Testar Conexão API
          </button>
        </div>
      </div>
  </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated } from '../../router/authGuard'
import { exchangeCodeForToken, saveTokens } from '../../services/authService'
import { testApiConnection as testBlingApiConnection } from '../../services/blingApiService'

const router = useRouter()

const isExchanging = ref(false)

const tokenInfo = ref({
  accessToken: '',
  refreshToken: '',
  expiresAt: '',
  expiresIn: '',
  scope: '',
  authorizationCode: ''
})

const tokenPreview = computed(() => {
  if (!tokenInfo.value.accessToken) return 'N/A'
  const token = tokenInfo.value.accessToken
  return `${token.substring(0, 20)}...${token.substring(token.length - 10)}`
})

const codePreview = computed(() => {
  if (!tokenInfo.value.authorizationCode) return 'N/A'
  const code = tokenInfo.value.authorizationCode
  return `${code.substring(0, 20)}...${code.substring(code.length - 10)}`
})

const tokenExpiration = computed(() => {
  if (!tokenInfo.value.expiresAt) return 'N/A'
  const expiresAt = parseInt(tokenInfo.value.expiresAt, 10)
  const now = Date.now()
  const diff = expiresAt - now
  
  if (diff <= 0) return 'Expirado'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
})

const authStatus = computed(() => isAuthenticated())

// Ref reativo para forçar atualização do computed
const tokenUpdateTrigger = ref(0)

const hasAccessToken = computed(() => {
  // Força reatividade usando o trigger
  tokenUpdateTrigger.value
  
  // Usa o tokenInfo reativo em vez de ler diretamente do localStorage
  const token = tokenInfo.value.accessToken
  const expiresAt = tokenInfo.value.expiresAt
  
  // Verifica se o token existe e não está expirado
  if (!token || !expiresAt) {
    return false
  }
  
  const expirationTime = parseInt(expiresAt, 10)
  return Date.now() < expirationTime
})

const loadTokenInfo = () => {
  tokenInfo.value = {
    accessToken: localStorage.getItem('bling_access_token') || '',
    refreshToken: localStorage.getItem('bling_refresh_token') || '',
    expiresAt: localStorage.getItem('bling_token_expires_at') || '',
    expiresIn: localStorage.getItem('bling_token_expires_in') || '',
    scope: localStorage.getItem('bling_token_scope') || '',
    authorizationCode: localStorage.getItem('bling_authorization_code') || ''
  }
  
  // Força atualização do computed
  tokenUpdateTrigger.value++
}

const refreshTokenInfo = () => {
  // Recarrega diretamente do localStorage
  loadTokenInfo()
  
  // Força atualização visual mostrando o status atual
  const hasToken = !!tokenInfo.value.accessToken
  const hasCode = !!tokenInfo.value.authorizationCode
  const status = hasToken ? 'Token disponível' : hasCode ? 'Aguardando troca de código' : 'Não autenticado'
  alert(`Informações atualizadas!\nStatus: ${status}`)
}

const exchangeCodeForTokenHandler = async () => {
  const code = tokenInfo.value.authorizationCode
  
  if (!code) {
    alert('Authorization code não encontrado!')
    return
  }
  
  // Solicita as credenciais do usuário
  const clientId = prompt('Digite o Client ID:')
  if (!clientId) {
    return
  }
  
  const clientSecret = prompt('Digite o Client Secret:')
  if (!clientSecret) {
    return
  }
  
  isExchanging.value = true
  
  try {
    // Passa as credenciais diretamente para o service
    const tokenResponse = await exchangeCodeForToken(code, { clientId, clientSecret })
    saveTokens(tokenResponse)
    
    // Recarrega as informações e força atualização do computed
    loadTokenInfo()
    
    // Pequeno delay para garantir que o localStorage foi atualizado
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Força nova atualização para garantir que o botão seja habilitado
    loadTokenInfo()
    
    alert('Token obtido com sucesso!')
  } catch (error: any) {
    console.error('Erro ao trocar code por token:', error)
    alert(`Erro: ${error.message || 'Erro ao obter token'}`)
  } finally {
    isExchanging.value = false
  }
}

const testApiConnection = async () => {
  // Verifica se há authorization_code mas não há access_token
  const authCode = tokenInfo.value.authorizationCode
  const accessToken = tokenInfo.value.accessToken
  
  if (authCode && !accessToken) {
    alert('Você precisa trocar o Authorization Code por Access Token primeiro. Clique em "Trocar Code por Token".')
    return
  }
  
  if (!accessToken) {
    alert('Token não encontrado. Por favor, faça login e troque o código por token.')
    return
  }
  
  try {
    const result = await testBlingApiConnection()
    
    if (result.success) {
      alert(result.message)
      console.log('Dados recebidos:', result.data)
    } else {
      alert(result.message)
    }
  } catch (error: any) {
    console.error('Erro ao testar conexão:', error)
    alert(error.message || 'Erro ao testar conexão com a API')
  }
}

const handleLogout = () => {
  // Limpa todos os dados de autenticação
  localStorage.removeItem('bling_access_token')
  localStorage.removeItem('bling_refresh_token')
  localStorage.removeItem('bling_token_expires_at')
  localStorage.removeItem('bling_token_expires_in')
  localStorage.removeItem('bling_token_scope')
  localStorage.removeItem('bling_client_id')
  
  // Redireciona para login
  router.push('/login')
}

onMounted(() => {
  // Carrega informações iniciais
  loadTokenInfo()
  
  // Verifica autenticação
  if (!isAuthenticated()) {
    router.push('/login')
    return
  }
})
</script>

<style scoped>
.dashboard-page {
  max-width: 1400px;
  width: 95%;
  margin: 2rem auto;
  margin-top: 6rem;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
}

.dashboard-header h1 {
  color: #2c3e50;
  margin: 0;
}

.btn-logout {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
}

.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.info-card,
.actions-card {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.info-card h2,
.actions-card h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item strong {
  color: #2c3e50;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  background-color: #e9ecef;
  color: #666;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.token-preview {
  background-color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #666;
  border: 1px solid #ddd;
}

.actions-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-btn {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  background-color: #35a372;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 184, 131, 0.3);
}

.action-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}

.action-btn-primary {
  background-color: #8A2BE2;
}

.action-btn-primary:hover:not(:disabled) {
  background-color: #7a1fd1;
  box-shadow: 0 4px 8px rgba(138, 43, 226, 0.3);
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .dashboard-content {
    grid-template-columns: 1fr;
  }
}
</style>