<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-4xl text-black font-bold mb-4">404</h1>
      <p class="text-xl text-gray-600 mb-4">Oops! Page not found</p>
      <RouterLink to="/" class="text-blue-500 hover:text-blue-700 underline">
        Return to Home
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, watch } from 'vue';

const route = useRoute();

onMounted(() => {
  console.error('404 Error: User attempted to access non-existent route:', route.path);
});

watch(
  () => route.path,
  (newPath) => {
    console.error('404 Error: User attempted to access non-existent route:', newPath);
  }
);
</script>
