import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Se crea la instancia de Axios que usará toda la app
const api = axios.create({ baseURL: 'http://localhost:3000' });

// La lógica para añadir el token se coloca aquí, dentro de la función de boot
export default defineBoot(({ app }) => {
  // 1. Intentamos obtener el token del localStorage al cargar la app.
  //    Asegúrate de que la clave 'authToken' sea la misma que usas al guardar el token en el login.
  const token = localStorage.getItem('authToken');

  // 2. Si encontramos un token, lo configuramos como cabecera por defecto para TODAS las peticiones.
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // 3. (Opcional pero muy recomendado) Interceptor para manejar errores 401.
  //    Esto se ejecuta si el token expira o es inválido.
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error('Error de autenticación (401). El token puede ser inválido o haber expirado.');
        // Limpiamos el token que ya no sirve
        localStorage.removeItem('authToken');
        // Redirigimos al usuario a la página de login para que vuelva a autenticarse.
        // router.push('/login'); // Descomenta esta línea si tienes una ruta de login.
      }
      return Promise.reject(error);
    }
  );

  // --- El resto de tu código original se mantiene igual ---
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };