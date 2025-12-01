<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <DevPoolBrand size="large" />
      </div>
      <!-- Dois menus no centro -->
      <nav class="menus">
        <RouterLink to="/" class="menu-item">
          <span class="menu-label">Home</span>
        </RouterLink>
        <RouterLink to="/mediator" class="menu-item">
          <span class="menu-label">Mediator</span>
        </RouterLink>
      </nav>
      <!-- Logo na extremidade direita -->
      <RouterLink to="/login">
        <button class="btn-entrar">Entrar</button>
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import DevPoolBrand from './DevPoolBrand.vue'
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.btn-entrar {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-entrar:hover {
  background-color: #35a372;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 184, 131, 0.3);
}

.menus {
  display: flex;
  gap: 2rem;
  flex: 1;
  justify-content: center;
  align-items: center;
}

.menu-item {
  text-decoration: none;
  color: inherit;
}

.menu-label {
  font-weight: 600;
  color: #2c3e50;
  cursor: pointer;
  padding: 0.5rem 1rem;
  display: inline-block;
  transition: color 0.3s ease;
  user-select: none;
}

.menu-item:hover .menu-label {
  color: #42b883;
}

.menu-item.router-link-active .menu-label {
  color: #42b883;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
}

/* Responsividade */
@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }

  .header-content {
    gap: 1rem;
  }

  .menus {
    gap: 1rem;
  }

  .menu-label {
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .btn-entrar {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  .logo svg {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .menus {
    gap: 0.5rem;
  }

  .menu-label {
    font-size: 0.85rem;
    padding: 0.4rem;
  }

}
</style>

