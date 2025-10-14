<template>
  <main>
    <h1>Design Pattern: Mediator</h1>
    <p>Comparando a comunicação entre componentes com e sem um mediador (Pinia).</p>
    <div class="container">
      <div class="column">
        <ProductPage_SemMediator />
      </div>

      <div class="column">
        <ProductPage_ComMediator />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import ProductPage_SemMediator from './components/ProductPage_SemMediator.vue'
import ProductPage_ComMediator from './components/ProductPage_ComMediator.vue'
</script>

<style>
/* Estilos adicionais específicos do App */
</style>

