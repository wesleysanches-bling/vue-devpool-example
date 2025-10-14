<template>
  <div>
    <h3>Componentes Desacoplados com Mediator</h3>
    <ProductImage />
    <ProductOptions />
    <AddToCartButton />
    <p class="legenda">Os componentes se comunicam através da store (mediator).</p>
  </div>
</template>

<script setup lang="ts">
// Note que os componentes se conhecem, mas não se falam diretamente.
import ProductImage from './com-mediator/ProductImage.vue'
import ProductOptions from './com-mediator/ProductOptions.vue'
import AddToCartButton from './com-mediator/AddToCartButton.vue'
// NENHUMA LÓGICA AQUI!
</script>

<style scoped>
.legenda {
  font-style: italic;
  font-size: 0.9em;
  color: #555;
}
</style>

