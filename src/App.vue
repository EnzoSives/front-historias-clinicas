<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from 'src/stores/authStore'; // Asegúrate de que la ruta sea correcta

// Obtenemos una instancia de nuestro store
const authStore = useAuthStore();

// Usamos el hook 'onMounted' que se ejecuta cuando el componente
// (y por tanto la aplicación) se ha montado en el DOM.
onMounted(() => {
  // Aquí llamamos a la acción para restaurar la sesión
  authStore.restoreFromStorage();
});
</script>

<template>
  <router-view />
</template>