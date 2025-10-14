<template>
  <div>
    <img :src="imageUrl" alt="Imagem do Produto" width="200" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  imageUrl: string;
}>();
</script>

