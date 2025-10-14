<template>
  <div>
    <h3>Componentes Fortemente Acoplados</h3>
    <ProductImage :image-url="currentImage" />
    <ProductOptions v-model="selectedColor" />
    <AddToCartButton :disabled="isButtonDisabled" />
    <p class="legenda">A lógica está toda no componente pai.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProductImage from './sem-mediator/ProductImage.vue'
import ProductOptions from './sem-mediator/ProductOptions.vue'
import AddToCartButton from './sem-mediator/AddToCartButton.vue'

interface ProductData {
  image: string;
  inStock: boolean;
}

interface ProductsData {
  [key: string]: ProductData;
}

// 1. O ESTADO ESTÁ TODO NO PAI
const selectedColor = ref<string>('azul')

const productData: ProductsData = {
  azul: {
    image: 'https://www.comerciomix.com.br/media/catalog/product/cache/39699d3c43c18428eb057c8e614b0843/c/a/camiseta-azul-royal-para-sublima_o-tradicional_1.jpg',
    inStock: true,
  },
  preto: {
    image: 'https://img.irroba.com.br/fit-in/600x600/filters:fill(fff):quality(80)/estampar/catalog/camisetas/preto-verso.jpg',
    inStock: false,
  },
}

// 2. A LÓGICA DE NEGÓCIO ESTÁ TODA NO PAI
const currentImage = computed(() => productData[selectedColor.value].image)
const isButtonDisabled = computed(() => !productData[selectedColor.value].inStock)
</script>

<style scoped>
.legenda {
  font-style: italic;
  font-size: 0.9em;
  color: #555;
}
</style>

