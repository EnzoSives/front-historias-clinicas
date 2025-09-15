<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2 q-pa-md">
        <q-card class="q-pa-md shadow-2 my_card" bordered>
          <q-card-section class="text-center">
            <div class="text-grey-9 text-h5 text-weight-bold">Crear Cuenta</div>
            <div class="text-grey-8">Completa tus datos para registrarte</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="handleSubmit" class="q-gutter-md">
              <div class="text-h6 text-secondary q-mb-sm">Datos de Usuario</div>
              <q-input filled v-model="form.username" label="Usuario" :rules="[
                (val: string) => !!val || 'El username es requerido',
                (val: string) =>
                  (val.trim().length >= 3 && val.trim().length <= 50) ||
                  'El username debe tener entre 3 y 50 caracteres',
              ]" />
              <q-input filled v-model="form.email" label="Email" type="email" :rules="[
                (val: string) => !!val || 'El email es requerido',
                (val: string) => /.+@.+\..+/.test(val) || 'Debe ser un email válido',
              ]" />
              <q-input filled v-model="form.password" label="Contraseña" type="password" :rules="[
                (val: string) => !!val || 'La contraseña es requerida',
                (val: string) =>
                  val.length >= 6 ||
                  'La contraseña debe tener al menos 6 caracteres',
              ]" />

              <q-separator class="q-my-lg" />

              <div class="text-h6 text-secondary q-mb-sm">Datos de Médico</div>
              <div class="row q-col-gutter-sm">
                <q-input filled v-model="form.nombre" label="Nombre" class="col-12 col-sm-6" :rules="[
                  (val: string) => !!val || 'El nombre es requerido',
                  (val: string) =>
                    (val.trim().length >= 2 && val.trim().length <= 100) ||
                    'El nombre debe tener entre 2 y 100 caracteres',
                ]" />
                <q-input filled v-model="form.apellido" label="Apellido" class="col-12 col-sm-6" :rules="[
                  (val: string) => !!val || 'El apellido es requerido',
                  (val: string) =>
                    (val.trim().length >= 2 && val.trim().length <= 100) ||
                    'El apellido debe tener entre 2 y 100 caracteres',
                ]" />
              </div>
              <div class="row q-col-gutter-sm">
                <q-input filled v-model="form.dni" label="DNI" class="col-12 col-sm-6" :rules="[
                  (val: string) => !!val || 'El DNI es requerido',
                  (val: string) =>
                    /^\d{7,8}$/.test(val) || 'El DNI debe tener 7 u 8 dígitos',
                ]" />
                <q-input filled v-model="form.especialidad" label="Especialidad" class="col-12 col-sm-6" :rules="[
                  (val: string) => !!val || 'La especialidad es requerida',
                ]" />
              </div>
              <q-input filled v-model="form.matricula" label="Matrícula"
                :rules="[(val: string) => !!val || 'La matrícula es requerida']" />

              <q-card-actions class="q-px-none">
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

// Define the shape of the registration form data
interface RegisterForm {
  username: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  dni: string;
  especialidad: string;
  matricula: string;
  telefono?: string;
  colegioMedico?: string;
}

const $q = useQuasar();
const loading = ref(false);
const router = useRouter();

const form: RegisterForm = reactive({
  username: "",
  email: "",
  password: "",
  nombre: "",
  apellido: "",
  dni: "",
  especialidad: "",
  matricula: "",
  telefono: "",
  colegioMedico: "",
});

const emit = defineEmits<{
  (e: "register", formData: RegisterForm): void;
  (e: "cancel"): void;
}>();

const handleSubmit = async () => {
  loading.value = true;
  try {
    // Make the API call to your backend
    const response = await api.post(
      "http://localhost:3000/auth/register",
      form
    ); // Use the imported 'api' instance
    console.log("Registration successful:", response.data);
    emit("register", { ...form });
    $q.notify({
      type: "positive",
      message: "Registro exitoso! Ahora puedes iniciar sesión.",
    });
    router.push("/login");
  } catch (error: any) {
    console.error("Error during registration:", error.response || error);
    $q.notify({
      type: "negative",
      message:
        error.response?.data?.message ||
        "Error en el registro. Intente nuevamente.",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.my_card {
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>