<template>
  <div class="login-page">
    <h1>Login</h1>
    <p>Entre com suas credenciais</p>
    
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email">E-mail</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          placeholder="seu@email.com"
          required
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input
          id="password"
          v-model="formData.password"
          type="password"
          placeholder="Digite sua senha"
          required
          class="form-input"
        />
      </div>

      <div class="form-options">
        <label class="checkbox-label">
          <input type="checkbox" v-model="formData.rememberMe" />
          <span>Lembrar-me</span>
        </label>
        <a href="#" class="forgot-password">Esqueceu a senha?</a>
      </div>

      <button type="submit" class="btn-submit" :disabled="isLoading">
        {{ isLoading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <div class="signup-link">
      <p>Não tem uma conta? <a href="#">Cadastre-se</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  email: '',
  password: '',
  rememberMe: false
})

const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    // Simulação de login
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Login realizado:', formData.value)
    
    // Redirecionar após login bem-sucedido
    router.push('/home')
  } catch (error) {
    console.error('Erro no login:', error)
  } finally {
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
  color: #666;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: #42b883;
}

.forgot-password {
  color: #42b883;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #35a372;
  text-decoration: underline;
}

.btn-submit {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  background-color: #35a372;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 184, 131, 0.3);
}

.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}

.signup-link {
  margin-top: 2rem;
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.signup-link p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.signup-link a {
  color: #42b883;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-link a:hover {
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

