<template>
  <div class="login-page">
    <h1>Conectar com Bling</h1>
    <p>Configure suas credenciais OAuth para autorizar o aplicativo</p>
    
    <form @submit.prevent="handleBlingAuth" class="login-form">
      <div class="form-group">
        <label for="clientId">Client ID *</label>
        <input
          id="clientId"
          v-model="formData.clientId"
          type="text"
          placeholder="Seu Client ID do Bling"
          required
          class="form-input"
        />
        <small class="form-hint">Obtido no cadastro do aplicativo no Bling</small>
      </div>

      <div class="form-group">
        <label for="clientSecret">Client Secret</label>
        <input
          id="clientSecret"
          v-model="formData.clientSecret"
          type="password"
          placeholder="Seu Client Secret (opcional)"
          class="form-input"
        />
        <small class="form-hint">Necessário apenas para trocar o código de autorização por token</small>
      </div>

      <div class="form-group">
        <label for="redirectUri">Redirect URI</label>
        <input
          id="redirectUri"
          v-model="formData.redirectUri"
          type="url"
          placeholder="http://localhost:5173/callback"
          required
          class="form-input"
        />
        <small class="form-hint">URL de callback configurada no aplicativo Bling</small>
      </div>

      <div class="form-group">
        <label for="scope">Escopos (Scopes)</label>
        <input
          id="scope"
          v-model="formData.scope"
          type="text"
          placeholder="contatos produtos pedidos"
          class="form-input"
        />
        <small class="form-hint">Permissões necessárias separadas por espaço (ex: contatos produtos pedidos). Deixe vazio para usar escopos padrão.</small>
      </div>

      <div class="login-info">
        <p class="info-text">
          Ao clicar em "Conectar com Bling", você será redirecionado para a página de autorização do Bling, 
          onde poderá fazer login e autorizar o acesso do aplicativo aos seus dados.
        </p>
      </div>

      <button 
        type="submit"
        class="btn-bling" 
        :disabled="isLoading || !formData.clientId"
      >
        <span v-if="!isLoading">Conectar com Bling</span>
        <span v-else>Redirecionando...</span>
      </button>
    </form>

    <div class="help-section">
      <p class="help-text">
        <strong>Não tem uma conta no Bling?</strong>
        <a href="https://www.bling.com.br/cadastro" target="_blank" class="help-link">
          Clique aqui para se cadastrar
        </a>
      </p>
      <p class="help-text" style="margin-top: 0.5rem;">
        <strong>Precisa criar um aplicativo?</strong>
        <a href="https://www.bling.com.br/central-de-extensoes" target="_blank" class="help-link">
          Acesse a Central de Extensões
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isLoading = ref(false)

const formData = ref({
  clientId: '',
  clientSecret: '',
  redirectUri: 'http://localhost:5173/callback',
  scope: 'contatos produtos pedidos'
})

const BLING_AUTH_URL = 'http://localhost/Api/v3/oauth/authorize'

// Gera um state aleatório seguro para proteção CSRF
const generateState = (): string => {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

const handleBlingAuth = () => {
  if (!formData.value.clientId || !formData.value.redirectUri) {
    return
  }

  isLoading.value = true
  
  try {
    const state = generateState()
    
    // Salva o state no sessionStorage para validação no callback
    sessionStorage.setItem('bling_oauth_state', state)
    
    // Salva a URL de autorização para detectar ambiente local no authService
    sessionStorage.setItem('bling_auth_url', BLING_AUTH_URL)
    
    // Salva temporariamente as credenciais no sessionStorage para uso no callback
    // (serão removidas após a troca do code por token)
    if (formData.value.clientId) {
      sessionStorage.setItem('bling_temp_client_id', formData.value.clientId)
    }
    if (formData.value.clientSecret) {
      sessionStorage.setItem('bling_temp_client_secret', formData.value.clientSecret)
    }
    
    // Monta a URL de autorização OAuth
    const authUrl = new URL(BLING_AUTH_URL)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('client_id', formData.value.clientId)
    authUrl.searchParams.append('state', state)
    authUrl.searchParams.append('redirect_uri', formData.value.redirectUri)
    
    // Adiciona escopos se fornecidos
    if (formData.value.scope && formData.value.scope.trim()) {
      authUrl.searchParams.append('scope', formData.value.scope.trim())
    }
    
    // Redireciona para autorização
    window.location.href = authUrl.toString()
  } catch (error) {
    console.error('Erro ao iniciar autorização:', error)
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  max-width: 500px;
  width: 90%;
  margin: 2rem auto;
  margin-top: 6rem;
  padding: 3rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-page h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.login-page > p {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
  text-align: left;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fff;
}

.form-input:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.form-hint {
  color: #999;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.login-info {
  margin-top: 0.5rem;
  margin-bottom: 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #42b883;
}

.info-text {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 0;
  text-align: left;
}

.btn-bling {
  width: 100%;
  background-color: #42b883;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-bling:hover:not(:disabled) {
  background-color: #35a372;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.3);
}

.btn-bling:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}

.help-section {
  margin-top: 2rem;
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.help-text {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.6;
}

.help-link {
  color: #42b883;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  display: inline-block;
  margin-left: 0.5rem;
}

.help-link:hover {
  color: #35a372;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-page {
    padding: 2rem 1.5rem;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>

