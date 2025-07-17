import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AuthUser, Doctor } from 'src/types/index'; // Import AuthUser and Doctor interfaces

export const useAuthStore = defineStore('auth', () => {
  // Estado reactivo
  const token = ref<string | null>(null);
  const user = ref<AuthUser | null>(null); // Changed 'doctor' to 'user' of type AuthUser
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // Acción para establecer los datos de login
  const setLoginData = (userData: AuthUser, authToken: string) => { // Expects AuthUser object and token
    user.value = userData;
    token.value = authToken;

    // Guarda en localStorage para persistencia
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('auth_user', JSON.stringify(userData)); // Store the whole user object
  };

  // Acción para cerrar sesión
  const logout = () => {
    user.value = null;
    token.value = null;

    // Limpia localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user'); // Corrected key to match 'auth_user'
  };

  // Acción para restaurar datos desde localStorage
  const restoreFromStorage = () => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user'); // Corrected key to match 'auth_user'

    if (storedToken) {
      token.value = storedToken;
    }

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser); // Parse into user object
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_user'); // Clear corrupted data
      }
    }
  };

  // Getters
  const getUserId = computed(() => user.value?.id || null);
  const getUserUsername = computed(() => user.value?.username || ''); // Access username from user object
  const getUserEmail = computed(() => user.value?.email || ''); // Access email from user object
  const getToken = computed(() => token.value);
  const getDoctorData = computed(() => user.value?.medico || null); // Provides access to the nested 'medico' object if it exists

  return {
    // Estado
    token,
    user, // Expose user instead of doctor
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
    getDoctorData // New getter for the nested doctor data
  };
});

// Call restoreFromStorage when the store is initialized (e.g., in App.vue's onMounted or a boot file)
useAuthStore().restoreFromStorage();