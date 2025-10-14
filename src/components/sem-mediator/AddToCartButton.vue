<template>
  <button :disabled="disabled">Adicionar ao Carrinho</button>
</template>

<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();
</script>

