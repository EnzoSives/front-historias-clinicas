<template>
  <q-card class="q-ma-md full-width">
    <q-card-section>
      <div class="text-h6 text-primary">
        <q-icon name="person_add" class="q-mr-sm" />
        {{ isEdit ? "Editar Paciente" : "Nuevo Paciente" }}
      </div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <div class="row q-gutter-md">
          <q-input v-model="form.nombre" label="Nombres" filled class="col"
            :rules="[(val) => !!val || 'Nombres requeridos']" />
          <q-input v-model="form.apellido" label="Apellidos" filled class="col"
            :rules="[(val) => !!val || 'Apellidos requeridos']" />
        </div>

        <div class="row q-gutter-md">
          <q-input v-model="form.dni" label="DNI/Cédula" filled class="col"
            :rules="[(val) => !!val || 'DNI requerido']" />

          <q-input v-model="fechaNacimientoModel" label="Fecha de Nacimiento" filled type="date" class="col"
            :rules="[(val) => !!val || 'Fecha de nacimiento requerida']" />
        </div>

        <div class="row q-gutter-md">
          <q-select v-model="form.sexo" label="Sexo" filled class="col" :options="genderOptions"
            :rules="[(val) => !!val || 'Sexo requerido']" emit-value map-options />
          <q-input v-model="form.lugarNacimiento" label="Lugar de Nacimiento" filled class="col" hint="Opcional" />
        </div>

        <q-input v-model="form.direccion" label="Dirección" filled :rules="[(val) => !!val || 'Dirección requerida']" />

        <div class="row q-gutter-md">
          <q-input v-model="form.telefonoFijo" label="Teléfono Fijo" filled class="col" hint="Opcional" />
          <q-input v-model="form.telefonoCelular" label="Teléfono Celular" filled class="col" hint="Opcional" />
        </div>

        <div class="row q-gutter-md">
          <q-input v-model="form.ocupacion" label="Ocupación" filled class="col" hint="Opcional" />
          <q-input v-model="form.estadoCivil" label="Estado Civil" filled class="col" hint="Opcional" />
        </div>

        <div class="row q-gutter-md">
          <q-input v-model="form.obraSocial" label="Obra Social" filled class="col" hint="Opcional" />
          <q-input v-model="form.afiliadoObraSocial" label="Afiliado Obra Social" filled class="col" hint="Opcional" />
        </div>

        <q-input v-model="form.antecedentesPersonalesMedicos" label="Antecedentes Personales Médicos" filled
          type="textarea" rows="3" hint="Opcional: Describa antecedentes médicos personales" />

        <q-input v-model="form.antecedentesQuirurgicos" label="Antecedentes Quirúrgicos" filled type="textarea" rows="3"
          hint="Opcional: Describa antecedentes quirúrgicos" />

        <q-input v-model="form.alergias" label="Alergias" filled type="textarea" rows="3"
          hint="Opcional: Describa las alergias conocidas del paciente" />

        <q-input v-model="form.antecedentesHeredoFamiliares" label="Antecedentes Heredo Familiares" filled
          type="textarea" rows="3" hint="Opcional: Describa antecedentes heredo familiares" />

        <q-input v-model="form.habitosToxicos" label="Hábitos Tóxicos" filled type="textarea" rows="3"
          hint="Opcional: Describa hábitos tóxicos" />

        <q-input v-model="form.medicacionHabitual" label="Medicamentos Habituales" filled type="textarea" rows="3"
          hint="Opcional: Liste los medicamentos que toma habitualmente" />

        <div class="text-h6 text-secondary q-mb-md">Examen Físico</div>
        <q-input v-model="form.examenFisicoHabito" label="Hábito" filled hint="Opcional" />
        <div class="row q-gutter-md">
          <q-input v-model.number="form.examenFisicoPeso" label="Peso (kg)" filled type="number" class="col"
            hint="Opcional" />
          <q-input v-model.number="form.examenFisicoTalla" label="Talla (cm)" filled type="number" class="col"
            hint="Opcional" />
          <q-input v-model.number="form.examenFisicoIMC" label="IMC" filled type="number" class="col" hint="Opcional" />
        </div>

        <div class="row q-gutter-md">
          <q-input v-model="form.examenFisicoTA" label="Tensión Arterial (TA)" filled class="col" hint="Opcional" />
          <q-input v-model="form.examenFisicoFC" label="Frecuencia Cardíaca (FC)" filled class="col" hint="Opcional" />
        </div>

        <div class="row q-gutter-md">
          <q-input v-model="form.examenFisicoFR" label="Frecuencia Respiratoria (FR)" filled class="col"
            hint="Opcional" />
          <q-input v-model="form.examenFisicoTemperatura" label="Temperatura (°C)" filled class="col" hint="Opcional" />
        </div>

        <q-input v-model="form.examenFisicoSistemaNervioso" label="Sistema Nervioso" filled type="textarea" rows="3"
          hint="Opcional" />
        <q-input v-model="form.examenFisicoAPCardiovascular" label="Aparato Cardiovascular" filled type="textarea"
          rows="3" hint="Opcional" />
        <q-input v-model="form.examenFisicoAPRespiratorio" label="Aparato Respiratorio" filled type="textarea" rows="3"
          hint="Opcional" />
        <q-input v-model="form.examenFisicoAPDigestivo" label="Aparato Digestivo" filled type="textarea" rows="3"
          hint="Opcional" />
        <q-input v-model="form.examenFisicoAPGenitourinario" label="Aparato Genitourinario" filled type="textarea"
          rows="3" hint="Opcional" />
        <q-input v-model="form.examenFisicoSistemaEndocrino" label="Sistema Endocrino" filled type="textarea" rows="3"
          hint="Opcional" />
        <q-input v-model="form.examenFisicoSistemaHematopoyetico" label="Sistema Hematopoyético" filled type="textarea"
          rows="3" hint="Opcional" />
        <q-input v-model="form.examenFisicoSistemaMusculoEsqueletico" label="Sistema Músculo Esquelético" filled
          type="textarea" rows="3" hint="Opcional" />
        <q-input v-model="form.examenFisicoPielAnexos" label="Piel y Anexos" filled type="textarea" rows="3"
          hint="Opcional" />

        <q-input v-model="form.primerObservacion" label="Primera Observación" filled type="textarea" rows="3"
          hint="Opcional" />

        <div class="row q-gutter-md">
          <q-file v-model="form.imagen" label="URL Imagen 1" filled class="col" hint="Opcional" />
          <q-file v-model="form.imagen2" label="URL Imagen 2" filled class="col" hint="Opcional" />
        </div>

        <q-card-actions align="right" class="q-pt-md">
          <q-btn flat color="grey-7" label="Cancelar" @click="$emit('cancel')" />
          <q-btn type="submit" color="primary" :label="isEdit ? 'Actualizar Paciente' : 'Crear Paciente'"
            :loading="loading" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue"; // ✅ 1. Importar 'computed'
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/authStore";
import type { Patient as PatientType } from "src/types/index";

interface Props {
  patient?: PatientType | null;
  isEdit?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  cancel: [];
  saved: [];
}>();

const $q = useQuasar();
const loading = ref(false);
const authStore = useAuthStore();

const genderOptions = [
  { label: "Masculino", value: "Masculino" },
  { label: "Femenino", value: "Femenino" },
  { label: "Otro", value: "Otro" },
];

const form = reactive<PatientType>({
  id_paciente: 0,
  id_medico: undefined,
  nombre: undefined,
  apellido: undefined,
  dni: undefined,
  sexo: undefined,
  edad: undefined,
  fechaNacimiento: undefined, // Este valor se mantendrá como Date o undefined
  lugarNacimiento: undefined,
  direccion: undefined,
  telefonoFijo: undefined,
  telefonoCelular: undefined,
  ocupacion: undefined,
  estadoCivil: undefined,
  obraSocial: undefined,
  afiliadoObraSocial: undefined,
  antecedentesPersonalesMedicos: undefined,
  antecedentesQuirurgicos: undefined,
  alergias: undefined,
  antecedentesHeredoFamiliares: undefined,
  habitosToxicos: undefined,
  medicacionHabitual: undefined,
  examenFisicoHabito: undefined,
  examenFisicoPeso: undefined,
  examenFisicoTalla: undefined,
  examenFisicoIMC: undefined,
  examenFisicoTA: undefined,
  examenFisicoFC: undefined,
  examenFisicoFR: undefined,
  examenFisicoTemperatura: undefined,
  examenFisicoSistemaNervioso: undefined,
  examenFisicoAPCardiovascular: undefined,
  examenFisicoAPRespiratorio: undefined,
  examenFisicoAPDigestivo: undefined,
  examenFisicoAPGenitourinario: undefined,
  examenFisicoSistemaEndocrino: undefined,
  examenFisicoSistemaHematopoyetico: undefined,
  examenFisicoSistemaMusculoEsqueletico: undefined,
  examenFisicoPielAnexos: undefined,
  primerObservacion: undefined,
  imagen: null,
  imagen2: null,
  imagenes: [],
  activo: undefined,
});

// ✅ 2. Crear la propiedad computada para la fecha
const fechaNacimientoModel = computed({
  get() {
    if (!form.fechaNacimiento) return '';
    try {
      const date = new Date(form.fechaNacimiento);
      // Corregir el problema de la zona horaria que puede restar un día
      const offset = date.getTimezoneOffset();
      const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
      return adjustedDate.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  },
  set(newValue: string) {
    if (!newValue) {
      form.fechaNacimiento = undefined;
    } else {
      // El nuevo valor del input (string) se convierte a un objeto Date
      form.fechaNacimiento = new Date(newValue);
    }
  }
});


watch(
  () => props.patient,
  (newPatient) => {
    if (newPatient) {
      Object.assign(form, newPatient);
      // ✅ 3. Simplificar el watch: solo asignamos el objeto Date
      if (newPatient.fechaNacimiento) {
        form.fechaNacimiento = new Date(newPatient.fechaNacimiento);
      }
    } else {
      Object.keys(form).forEach(key => (form as any)[key] = undefined);
      form.id_paciente = 0;
      form.imagen = null;
      form.imagen2 = null;
      form.imagenes = [];
      form.id_medico = authStore.user?.medico?.id_medico;
    }
  },
  { immediate: true, deep: true }
);

const handleSubmit = async () => {
  loading.value = true;
  const medicoId = authStore.user?.medico?.id_medico;
  const formData = new FormData();

  for (const key in form) {
    if (key === 'imagenes') continue;
    if (props.isEdit && key === 'id_paciente') continue;

    const value = (form as any)[key];
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (key === 'fechaNacimiento' && value instanceof Date) {
        // Aseguramos que se envíe en formato ISO
        formData.append(key, value.toISOString());
      } else if (key !== 'imagen' && key !== 'imagen2') {
        formData.append(key, String(value));
      }
    }
  }

  if (medicoId) {
    formData.set('id_medico', String(medicoId));
  }

  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (props.isEdit && form.id_paciente) {
      await api.patch(
        `http://localhost:3000/paciente/actualizar/${form.id_paciente}`,
        formData,
        config
      );
      $q.notify({
        type: 'positive',
        message: 'Paciente actualizado exitosamente!',
      });
    } else {
      await api.post('http://localhost:3000/paciente/crear', formData, config);
      $q.notify({
        type: 'positive',
        message: 'Paciente creado exitosamente!',
      });
    }

    emit('saved');
  } catch (error: any) {
    console.error('Error saving patient:', error.response || error);
    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Error al guardar el paciente. Intente nuevamente.',
    });
  } finally {
    loading.value = false;
  }
};
</script>