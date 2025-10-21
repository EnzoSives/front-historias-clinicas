import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AuthUser } from 'src/types/index';
// ✅ **PASO 1: Importar la instancia de Axios**
import { api } from 'src/boot/axios';

export const useAuthStore = defineStore('auth', () => {
  // Estado reactivo
  const token = ref<string | null>(null);
  const user = ref<AuthUser | null>(null);
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // ✅ **PASO 2: Acción de login MODIFICADA**
  const setLoginData = (userData: AuthUser, authToken: string) => {
    user.value = userData;
    token.value = authToken;

    // Guarda en localStorage para persistencia
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));

    // **LÍNEA CRÍTICA: Configura Axios para que use el token**
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  // ✅ **PASO 3: Acción de logout MODIFICADA**
  const logout = () => {
    user.value = null;
    token.value = null;

    // Limpia localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    // **LÍNEA CRÍTICA: Elimina el token de Axios**
    delete api.defaults.headers.common['Authorization'];
  };

  // ✅ **PASO 4: Acción de restaurar MODIFICADA**
  const restoreFromStorage = () => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      token.value = storedToken;
      try {
        user.value = JSON.parse(storedUser);
        // **LÍNEA CRÍTICA: Configura Axios si se restaura la sesión**
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Error al restaurar datos de usuario, limpiando sesión:', error);
        logout(); // Si los datos están corruptos, cierra sesión.
      }
    }
  };

  // Getters (sin cambios)
  const getUserId = computed(() => user.value?.id || null);
  const getUserUsername = computed(() => user.value?.username || '');
  const getUserEmail = computed(() => user.value?.email || '');
  const getToken = computed(() => token.value);
  // Este getter es clave para obtener el ID del médico
  const getMedicoId = computed(() => user.value?.medico?.id_medico || null);

  return {
    // Estado
    token,
    user,
    isAuthenticated,

    // Acciones
    setLoginData,
    logout,
    restoreFromStorage,

    // Getters
    getUserId,
    getUserUsername,
    getUserEmail,
    getToken,
    getMedicoId, // Getter corregido para el ID del médico
  };
});
