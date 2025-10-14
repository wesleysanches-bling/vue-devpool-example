<template>
  <div class="options">
    <label>Cor:</label>
    <select :value="modelValue" @change="handleChange">
      <option value="azul">Azul</option>
      <option value="preto">Preto</option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

