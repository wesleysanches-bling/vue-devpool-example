<template>
  <div class="callback-page">
    <div v-if="isProcessing" class="processing">
      <h1>Processando autorização...</h1>
      <p>Aguarde enquanto processamos sua autorização.</p>
    </div>

    <div v-else-if="error" class="error">
      <h1>Erro na autorização</h1>
      <p>{{ error }}</p>
      <button @click="goToLogin" class="btn-retry">Tentar novamente</button>
    </div>

    <div v-else-if="success" class="success">
      <h1>Autorização realizada com sucesso!</h1>
      <p>Você será redirecionado em breve...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { exchangeCodeForToken, saveTokens } from '../services/authService'

const route = useRoute()
const router = useRouter()

const isProcessing = ref(true)
const error = ref<string | null>(null)
const success = ref(false)

const goToLogin = () => {
  router.push('/login')
}

const saveAuthorizationCode = async (code: string, state: string) => {
  try {
    // Salva o código de autorização e informações relacionadas
    localStorage.setItem('bling_authorization_code', code)
    localStorage.setItem('bling_oauth_state', state)
    localStorage.setItem('bling_code_received_at', String(Date.now()))
    
    // Remove o state do sessionStorage após validação
    sessionStorage.removeItem('bling_oauth_state')
    
    // Verifica se há credenciais temporárias no sessionStorage
    const tempClientId = sessionStorage.getItem('bling_temp_client_id')
    const tempClientSecret = sessionStorage.getItem('bling_temp_client_secret')
    
    // Se tiver credenciais, tenta automaticamente trocar o code por token
    if (tempClientId && tempClientSecret) {
      try {
        const tokenResponse = await exchangeCodeForToken(code, {
          clientId: tempClientId,
          clientSecret: tempClientSecret
        })
        
        // Salva os tokens
        saveTokens(tokenResponse)
        
        // Limpa as credenciais temporárias do sessionStorage
        sessionStorage.removeItem('bling_temp_client_id')
        sessionStorage.removeItem('bling_temp_client_secret')
        
        success.value = true
        isProcessing.value = false
        
        // Redireciona para dashboard
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 1000)
      } catch (tokenError: any) {
        // Se falhar ao trocar o code por token, apenas salva o code
        // O usuário poderá trocar manualmente no dashboard
        console.error('Erro ao trocar code por token automaticamente:', tokenError)
        console.error('Detalhes:', {
          message: tokenError.message,
          code: code.substring(0, 20) + '...',
          hasClientId: !!tempClientId,
          hasClientSecret: !!tempClientSecret
        })
        
        // Salva o code mesmo em caso de erro para troca manual
        success.value = true
        isProcessing.value = false
        
        // Limpa as credenciais temporárias mesmo em caso de erro
        sessionStorage.removeItem('bling_temp_client_id')
        sessionStorage.removeItem('bling_temp_client_secret')
        
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 1000)
      }
    } else {
      // Se não tiver credenciais, apenas salva o code
      success.value = true
      isProcessing.value = false
      
      // Redireciona para dashboard
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1000)
    }
  } catch (err: any) {
    console.error('Erro ao salvar código:', err)
    error.value = 'Erro ao processar autorização'
    isProcessing.value = false
  }
}

onMounted(async () => {
  const code = route.query.code as string
  const state = route.query.state as string
  const errorParam = route.query.error as string

  // Verifica erro na autorização
  if (errorParam) {
    error.value = 'Autorização negada pelo usuário'
    isProcessing.value = false
    return
  }

  // Verifica se recebeu o code
  if (!code) {
    error.value = 'Código de autorização não recebido'
    isProcessing.value = false
    return
  }

  // Valida o state (proteção CSRF)
  const savedState = sessionStorage.getItem('bling_oauth_state')
  if (!savedState || savedState !== state) {
    error.value = 'Erro de segurança: State inválido'
    isProcessing.value = false
    return
  }

  // Salva o código e tenta trocar por token automaticamente
  await saveAuthorizationCode(code, state)
})
</script>

<style scoped>
.callback-page {
  max-width: 500px;
  width: 90%;
  margin: 2rem auto;
  margin-top: 6rem;
  padding: 3rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.callback-page h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.callback-page p {
  color: #666;
  margin-bottom: 1.5rem;
}

.processing {
  color: #42b883;
}

.error {
  color: #e74c3c;
}

.success {
  color: #42b883;
}

.btn-retry {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-retry:hover {
  background-color: #35a372;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 184, 131, 0.3);
}
</style>

