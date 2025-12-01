<template>
  <div class="devpool-brand" :class="[`size-${size}`]">
    <div class="brand-container">
      <div class="brand-content">
        <span class="dev-text">Dev</span><span class="pool-text">Pool</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large' | 'xlarge'
}

withDefaults(defineProps<Props>(), {
  size: 'medium'
})
</script>

<style scoped>
.devpool-brand {
  display: inline-block;
}

.brand-container {
  background-color: #8A2BE2;
  padding: 0.5rem 1rem;
  display: inline-block;
  border-radius: 6px;
}

.brand-content {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.dev-text {
  color: white;
}

.pool-text {
  color: #ADFF2F; /* Verde limão */
}

/* Tamanhos */
.size-small .brand-content {
  font-size: 0.875rem;
}

.size-small .brand-container {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
}

.size-medium .brand-content {
  font-size: 1.25rem;
}

.size-medium .brand-container {
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.size-large .brand-content {
  font-size: 1.75rem;
}

.size-large .brand-container {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
}

.size-xlarge .brand-content {
  font-size: 2.5rem;
}

.size-xlarge .brand-container {
  padding: 1rem 2rem;
  border-radius: 10px;
}
</style>

