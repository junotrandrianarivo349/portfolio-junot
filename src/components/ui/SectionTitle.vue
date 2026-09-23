<script setup lang="ts">
defineProps<{ id: string; title: string; intro?: string }>()
</script>

<template>
  <div class="mb-10 max-w-2xl sm:mb-14">
    <h2
      :id="id"
      class="text-3xl font-bold tracking-tight sm:text-4xl"
    >
      {{ title }}
    </h2>
    <p
      v-if="intro"
      class="mt-3 text-lg text-muted"
    >
      {{ intro }}
    </p>
  </div>
</template>
