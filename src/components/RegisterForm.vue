<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2 q-pa-md">
        <q-card class="q-pa-md shadow-2 my_card" bordered style="max-width: 650px;">
          <q-card-section class="text-center">
            <div class="text-grey-9 text-h5 text-weight-bold">Crear Cuenta de Médico</div>
            <div class="text-grey-8">Completa tus datos para registrarte</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="handleSubmit" class="q-gutter-md">
              <div class="text-h6 text-secondary q-mb-sm"><q-icon name="account_circle" /> Datos de Usuario</div>
              <q-input filled dense v-model="form.username" label="Usuario" :rules="[
                (val: string) => !!val || 'El username es requerido',
                (val: string) => (val.trim().length >= 3 && val.trim().length <= 50) || 'El username debe tener entre 3 y 50 caracteres',
              ]" />
              <q-input filled dense v-model="form.email" label="Email" type="email" :rules="[
                (val: string) => !!val || 'El email es requerido',
                (val: string) => /.+@.+\..+/.test(val) || 'Debe ser un email válido',
              ]" />
              <q-input filled dense v-model="form.password" label="Contraseña" type="password" :rules="[
                (val: string) => !!val || 'La contraseña es requerida',
                (val: string) => val.length >= 6 || 'La contraseña debe tener al menos 6 caracteres',
              ]" />

              <q-separator class="q-my-lg" />

              <div class="text-h6 text-secondary q-mb-sm"><q-icon name="medical_information" /> Datos Profesionales
              </div>
              <div class="row q-col-gutter-sm">
                <q-input filled dense v-model="form.nombre" label="Nombre" class="col-12 col-sm-6" :rules="[
                  (val: string) => !!val || 'El nombre es requerido',
                  (val: string) => (val.trim().length >= 2 && val.trim().length <= 100) || 'El nombre debe tener entre 2 y 100 caracteres',
                ]" />
                <q-input filled dense v-model="form.apellido" label="Apellido" class="col-12 col-sm-6" :rules="[
                  (val: string) => !!val || 'El apellido es requerido',
                  (val: string) => (val.trim().length >= 2 && val.trim().length <= 100) || 'El apellido debe tener entre 2 y 100 caracteres',
                ]" />
              </div>
              <div class="row q-col-gutter-sm">
                <q-input filled dense v-model="form.dni" label="DNI" class="col-12 col-sm-6" :rules="[
                  (val: string) => !!val || 'El DNI es requerido',
                  (val: string) => /^\d{7,8}$/.test(val) || 'El DNI debe tener 7 u 8 dígitos',
                ]" />
                <q-input filled dense v-model="form.telefono" label="Teléfono Personal (Opcional)"
                  class="col-12 col-sm-6" />
              </div>
              <div class="row q-col-gutter-sm">
                <q-input filled dense v-model="form.especialidad" label="Especialidad" class="col-12 col-sm-6"
                  :rules="[(val: string) => !!val || 'La especialidad es requerida']" />
                <q-input filled dense v-model="form.matricula" label="Matrícula" class="col-12 col-sm-6"
                  :rules="[(val: string) => !!val || 'La matrícula es requerida']" />
              </div>
              <q-input filled dense v-model="form.colegioMedico" label="Colegio Médico (Opcional)" />

              <q-separator class="q-my-lg" />

              <div class="text-h6 text-secondary q-mb-sm"><q-icon name="business" /> Datos del Consultorio (Opcional)
              </div>
              <q-input filled dense v-model="form.direccionConsultorio" label="Dirección del Consultorio" />
              <q-input filled dense v-model="form.telefonoConsultorio" label="Teléfono del Consultorio" />
              <q-input filled dense v-model="form.horarioAtencion" label="Horario de Atención"
                placeholder="Ej: Lunes a Viernes de 9 a 17hs" />
              <q-input filled dense v-model="form.obrasSocialesAcepta" label="Obras Sociales que Acepta"
                hint="Separadas por coma si son varias" />
              <q-input filled dense v-model="form.biografia" label="Biografía / Descripción Profesional" type="textarea"
                autogrow />
              <!-- <q-input filled dense v-model="form.foto" label="URL de Foto de Perfil"
                hint="Pega la URL de una imagen" /> -->


              <q-card-actions class="q-px-none q-mt-lg">
                <q-btn unelevated color="light-blue-7" size="lg" class="full-width" label="Registrarse" type="submit"
                  :loading="loading" />
              </q-card-actions>
              <q-card-section class="text-center q-pa-none">
                <p class="text-grey-6">
                  ¿Ya tienes una cuenta?
                  <router-link to="/login">Inicia Sesión</router-link>
                </p>
              </q-card-section>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios"; // Import the API instance
import { useRouter } from "vue-router";
import type { Doctor } from 'src/types'; // Importar Doctor

// Define the shape combining User and Doctor fields for registration
// Asegúrate que coincida con RegisterDto y CreateMedicoDto del backend
interface RegisterForm extends Partial<Omit<Doctor, 'id_medico' | 'activo'>> { // Omitimos id y activo, hacemos el resto opcional con Partial
  username: string;
  email: string;
  password: string;
  nombre: string;     // Requerido explícitamente
  apellido: string;   // Requerido explícitamente
  dni: string;        // Requerido explícitamente
  especialidad: string; // Requerido explícitamente
  matricula: string;  // Requerido explícitamente
}


const $q = useQuasar();
const loading = ref(false);
const router = useRouter();

// Inicializa el formulario reactivo con todos los campos
const form = reactive<RegisterForm>({
  username: "",
  email: "",
  password: "",
  nombre: "",
  apellido: "",
  dni: "",
  especialidad: "",
  matricula: "",
  telefono: undefined, // Opcional
  colegioMedico: undefined, // Opcional
  direccionConsultorio: undefined, // Opcional
  telefonoConsultorio: undefined, // Opcional
  horarioAtencion: undefined, // Opcional
  obrasSocialesAcepta: undefined, // Opcional
  biografia: undefined, // Opcional
  foto: undefined // Opcional
});

// El emit no necesita cambios si RegisterForm ahora tiene todos los campos
const emit = defineEmits<{
  (e: "register", formData: RegisterForm): void;
  (e: "cancel"): void;
}>();

const handleSubmit = async () => {
  loading.value = true;
  try {
    // El objeto 'form' ya contiene todos los campos necesarios
    const response = await api.post(
      "http://66.97.45.96:3007/auth/register",
      form
    );
    console.log("Registration successful:", response.data);
    emit("register", { ...form }); // Envía todos los datos recolectados
    $q.notify({
      type: "positive",
      message: "Registro exitoso! Ahora puedes iniciar sesión.",
      position: "top",
    });
    router.push("/login");
  } catch (error: any) {
    console.error("Error during registration:", error.response?.data || error);
    // Intenta mostrar el primer error de validación si existe
    let specificError = '';
    if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
      specificError = error.response.data.message[0];
    }
    $q.notify({
      type: "negative",
      message: specificError || error.response?.data?.message || "Error en el registro. Verifique los datos e intente nuevamente.",
      position: "top",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.my_card {
  width: 100%;
  /* max-width: 500px; */
  /* Eliminado o ajustado arriba */
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.q-page {
  padding-top: 20px;
  /* Añade un poco de espacio arriba */
  padding-bottom: 20px;
  /* Añade un poco de espacio abajo */
}
</style>