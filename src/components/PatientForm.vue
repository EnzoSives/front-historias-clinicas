<template>
  <q-card class="q-ma-sm full-width">
    <q-card-section class="q-pb-none">
      <div class="text-h6 text-primary">
        <q-icon name="person_add" class="q-mr-sm" />
        {{ isEdit ? "Editar Paciente" : "Nuevo Paciente" }}
      </div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="handleSubmit">
        <q-banner v-if="!isReadOnly" class="bg-warning text-white q-mb-md" rounded>
          <template v-slot:avatar>
            <q-icon name="lock" color="white" />
          </template>
          Estás en modo solo lectura. No tenés permisos para editar este paciente.
        </q-banner>

        <q-stepper v-model="step" flat animated color="primary" alternative-labels>
          <!-- ===== PASO 1: DATOS BÁSICOS ===== -->
          <q-step :name="1" title="Datos Básicos" icon="person" :done="step > 1">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.nombre" label="Nombres"
                  :rules="[(val) => !!val || 'Nombres requeridos']" :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.apellido" label="Apellidos"
                  :rules="[(val) => !!val || 'Apellidos requeridos']" :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input dense outlined v-model="form.dni" label="DNI/Cédula" hint="Opcional" :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-4">
                <DatePicker v-model="fechaNacimientoModel" mode="date" is24hr>
                  <template v-slot="{ togglePopover }">
                    <q-input outlined v-model="manualDateInput" dense label="Fecha de Nacimiento"
                      style="min-width: 160px" class="date-input" mask="##/##/####" placeholder="DD/MM/AAAA"
                      hint="Opcional" :disable="!isReadOnly" @blur="handleManualDateInput"
                      @keyup.enter="handleManualDateInput">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer" color="primary" @click="togglePopover" />
                      </template>
                    </q-input>
                  </template>
                </DatePicker>
              </div>
              <div class="col-12 col-sm-4">
                <q-select dense outlined v-model="form.sexo" label="Sexo" :options="genderOptions" hint="Opcional"
                  emit-value map-options :disable="!isReadOnly" />
              </div>
            </div>
          </q-step>

          <!-- ===== PASO 2: CONTACTO & ANTECEDENTES ===== -->
          <q-step :name="2" title="Contacto & Antecedentes" icon="contact_mail" :done="step > 2">
            <div class="text-subtitle2 text-primary q-mb-sm">Información de Contacto</div>
            <div class="row q-col-gutter-sm q-mb-md">
              <div class="col-12">
                <q-input dense outlined v-model="form.direccion" label="Dirección" hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.telefonoCelular" label="Teléfono Celular" hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.telefonoFijo" label="Teléfono Fijo" hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
            </div>

            <div class="text-subtitle2 text-primary q-mb-sm">Datos Personales</div>
            <div class="row q-col-gutter-sm q-mb-md">
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.lugarNacimiento" label="Lugar de Nacimiento" hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.ocupacion" label="Ocupación" hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.estadoCivil" label="Estado Civil" hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.obraSocial" label="Obra Social" hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.afiliadoObraSocial" label="Afiliado Obra Social" hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
            </div>

            <div class="text-subtitle2 text-primary q-mb-sm">Antecedentes Médicos</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-input dense outlined v-model="form.antecedentesPersonalesMedicos" label="Antecedentes Personales"
                  type="textarea" rows="2" hint="Opcional" :disable="!isReadOnly" />
              </div>
              <div class="col-12">
                <q-input dense outlined v-model="form.antecedentesQuirurgicos" label="Antecedentes Quirúrgicos"
                  type="textarea" rows="2" hint="Opcional" :disable="!isReadOnly" />
              </div>
              <div class="col-12">
                <q-input dense outlined v-model="form.antecedentesHeredoFamiliares"
                  label="Antecedentes Heredo-Familiares" type="textarea" rows="2" hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
              <div class="col-12">
                <q-input dense outlined v-model="form.alergias" label="Alergias" type="textarea" rows="2"
                  hint="Opcional" :disable="!isReadOnly" />
              </div>
              <div class="col-12">
                <q-input dense outlined v-model="form.medicacionHabitual" label="Medicamentos Habituales"
                  type="textarea" rows="2" hint="Opcional" :disable="!isReadOnly" />
              </div>
              <div class="col-12">
                <q-input dense outlined v-model="form.habitosToxicos" label="Hábitos Tóxicos" type="textarea" rows="2"
                  hint="Opcional" :disable="!isReadOnly" />
              </div>
              <div class="col-12">
                <q-input dense outlined v-model="form.antecedentesGinecoObstetricos"
                  label="Antecedentes Gineco-Obstétricos" type="textarea" rows="2" hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
            </div>
          </q-step>

          <!-- ===== PASO 3: EXAMEN FÍSICO & ADJUNTOS ===== -->
          <q-step :name="3" title="Examen Físico & Adjuntos" icon="monitor_heart">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-3">
                <q-input dense outlined v-model.number="form.examenFisicoPeso" label="Peso (kg)" type="number"
                  hint="Opcional" :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-3">
                <q-input dense outlined v-model.number="form.examenFisicoTalla" label="Talla (cm)" type="number"
                  hint="Opcional" :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-3">
                <q-input dense outlined v-model.number="form.examenFisicoIMC" label="IMC" type="number" hint="Calculado"
                  :disable="!isReadOnly" readonly />
              </div>
              <div class="col-12 col-sm-3">
                <q-input dense outlined v-model="form.examenFisicoTemperatura" label="Temp. (°C)" hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
            </div>

            <div class="row q-col-gutter-sm q-mt-xs">
              <div class="col-12 col-sm-3">
                <q-input dense outlined v-model="form.examenFisicoTA" label="T.A." hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-3">
                <q-input dense outlined v-model="form.examenFisicoFC" label="F.C." hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-3">
                <q-input dense outlined v-model="form.examenFisicoFR" label="F.R." hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-3">
                <q-input dense outlined v-model="form.examenFisicoHabito" label="Hábito" hint="Opcional"
                  :disable="!isReadOnly" />
              </div>
            </div>

            <q-separator class="q-my-sm" />

            <q-tabs v-model="activeSystemTab" dense class="text-grey" active-color="primary" indicator-color="primary"
              align="justify" narrow-indicator>
              <q-tab name="nervous" label="Nervioso" :disable="!isReadOnly" />
              <q-tab name="cardio" label="Cardiovascular" :disable="!isReadOnly" />
              <q-tab name="respiratory" label="Respiratorio" :disable="!isReadOnly" />
              <q-tab name="digestive" label="Digestivo" :disable="!isReadOnly" />
              <q-tab name="genitourinary" label="Genitourinario" :disable="!isReadOnly" />
              <q-tab name="endocrine" label="Endocrino" :disable="!isReadOnly" />
              <q-tab name="hematopoietic" label="Hematopoyético" :disable="!isReadOnly" />
              <q-tab name="musculoskeletal" label="M. Esquelético" :disable="!isReadOnly" />
              <q-tab name="skin" label="Piel y Anexos" :disable="!isReadOnly" />
            </q-tabs>

            <q-tab-panels v-model="activeSystemTab" animated>
              <q-tab-panel name="nervous" class="q-pa-none q-pt-sm">
                <q-input dense outlined v-model="form.examenFisicoSistemaNervioso" label="Sistema Nervioso"
                  type="textarea" rows="2" hint="Opcional" :disable="!isReadOnly" />
              </q-tab-panel>
              <q-tab-panel name="cardio" class="q-pa-none q-pt-sm">
                <q-input dense outlined v-model="form.examenFisicoAPCardiovascular" label="Sistema Cardiovascular"
                  type="textarea" rows="2" hint="Opcional" :disable="!isReadOnly" />
              </q-tab-panel>
              <q-tab-panel name="respiratory" class="q-pa-none q-pt-sm">
                <q-input dense outlined v-model="form.examenFisicoAPRespiratorio" label="Sistema Respiratorio"
                  type="textarea" rows="2" hint="Opcional" :disable="!isReadOnly" />
              </q-tab-panel>
              <q-tab-panel name="digestive" class="q-pa-none q-pt-sm">
                <q-input dense outlined v-model="form.examenFisicoAPDigestivo" label="Sistema Digestivo" type="textarea"
                  rows="2" hint="Opcional" :disable="!isReadOnly" />
              </q-tab-panel>
              <q-tab-panel name="genitourinary" class="q-pa-none q-pt-sm">
                <q-input dense outlined v-model="form.examenFisicoAPGenitourinario" label="Sistema Genitourinario"
                  type="textarea" rows="2" hint="Opcional" :disable="!isReadOnly" />
              </q-tab-panel>
              <q-tab-panel name="endocrine" class="q-pa-none q-pt-sm">
                <q-input dense outlined v-model="form.examenFisicoSistemaEndocrino" label="Sistema Endocrino"
                  type="textarea" rows="2" hint="Opcional" :disable="!isReadOnly" />
              </q-tab-panel>
              <q-tab-panel name="hematopoietic" class="q-pa-none q-pt-sm">
                <q-input dense outlined v-model="form.examenFisicoSistemaHematopoyetico" label="Sistema Hematopoyético"
                  type="textarea" rows="2" hint="Opcional" :disable="!isReadOnly" />
              </q-tab-panel>
              <q-tab-panel name="musculoskeletal" class="q-pa-none q-pt-sm">
                <q-input dense outlined v-model="form.examenFisicoSistemaMusculoEsqueletico"
                  label="Sistema Músculo Esquelético" type="textarea" rows="2" hint="Opcional" :disable="!isReadOnly" />
              </q-tab-panel>
              <q-tab-panel name="skin" class="q-pa-none q-pt-sm">
                <q-input dense outlined v-model="form.examenFisicoPielAnexos" label="Piel y Anexos" type="textarea"
                  rows="2" hint="Opcional" :disable="!isReadOnly" />
              </q-tab-panel>
            </q-tab-panels>
            <q-separator class="q-my-md" />
            <div class="text-subtitle2 text-primary q-mb-sm">Observaciones y Laboratorios</div>
            <div class="row q-col-gutter-sm q-mb-md">
              <div class="col-12">
                <q-input dense outlined v-model="form.primerObservacion" label="Primera Observación" type="textarea"
                  rows="3" hint="Opcional" :disable="!isReadOnly" />
              </div>
              <div class="col-12">
                <q-input dense outlined v-model="form.laboratorios" label="Estudios de Laboratorio" type="textarea"
                  rows="3" hint="Opcional" :disable="!isReadOnly" />
              </div>
            </div>
            <div class="text-subtitle2 text-primary q-mb-sm">Archivos Adjuntos</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-file dense outlined v-model="form.imagen" label="Imagen 1" hint="Opcional" :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-6">
                <q-file dense outlined v-model="form.imagen2" label="Imagen 2" hint="Opcional" :disable="!isReadOnly" />
              </div>
            </div>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation class="row justify-between q-pt-sm">
              <div>
                <q-btn v-if="step > 1" flat color="grey-7" label="Atrás" @click="step--" class="q-mr-sm" />
                <q-btn flat dense color="negative" label="Cancelar" @click="$emit('cancel')" />
              </div>
              <div class="row q-gutter-sm">
                <q-btn v-if="step < 3" color="positive" label="Siguiente" @click="step++" />
                <q-btn type="submit" color="primary" :label="isEdit ? 'Actualizar' : 'Guardar'" :loading="loading"
                  :disable="!isReadOnly" />
              </div>
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/authStore";
import type { Patient as PatientType } from "src/types/index";
import { DatePicker } from 'v-calendar';

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
const step = ref(1);
const authStore = useAuthStore();
const activeSystemTab = ref("nervous");
const manualDateInput = ref("");

// Propiedad computada para determinar si el formulario es de solo lectura
const isReadOnly = computed(() => {
  // Obtiene el nombre del médico del store, asegurándose de que exista
  const doctorName = authStore.user?.medico?.nombre;
  // Compara el nombre (en minúsculas) con "florencia"
  // Si el nombre NO es "florencia", devuelve true (mostrar)
  // Si el nombre ES "florencia", devuelve false (ocultar)
  // Si no hay médico o nombre, por defecto se muestra (devuelve true)
  return doctorName?.toLowerCase() !== 'null';
});

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
  fechaNacimiento: undefined,
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
  antecedentesGinecoObstetricos: undefined,
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
  laboratorios: undefined,
  imagen: null,
  imagen2: null,
  imagenes: [],
  activo: undefined,
});

const fechaNacimientoModel = computed({
  get() {
    if (!form.fechaNacimiento) return null;
    try {
      return new Date(form.fechaNacimiento);
    } catch (e) {
      return null;
    }
  },
  set(newValue: Date | null) {
    if (!newValue) {
      form.fechaNacimiento = undefined;
      manualDateInput.value = "";
      return;
    }
    // DatePicker returns a Date object
    form.fechaNacimiento = newValue;
    // Sync manual input when date changes from calendar
    const day = String(newValue.getDate()).padStart(2, '0');
    const month = String(newValue.getMonth() + 1).padStart(2, '0');
    const year = newValue.getFullYear();
    manualDateInput.value = `${day}/${month}/${year}`;
  },
});

// Function to handle manual date input in DD/MM/YYYY format
const handleManualDateInput = () => {
  const input = manualDateInput.value.trim();

  // Si está vacío, limpiar la fecha
  if (!input) {
    form.fechaNacimiento = undefined;
    return;
  }

  // Si no está completo (menos de 10 caracteres), no validar aún
  if (input.length < 10) {
    return;
  }

  // Validate DD/MM/YYYY format
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = input.match(dateRegex);

  if (match) {
    const day = match[1];
    const month = match[2];
    const year = match[3];

    if (day && month && year) {
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);

      // Validate ranges
      if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
        // Create date in local timezone to avoid timezone offset issues
        const date = new Date(yearNum, monthNum - 1, dayNum, 12, 0, 0);

        // Verify it's a valid date (check if the date components match)
        if (!isNaN(date.getTime()) &&
          date.getDate() === dayNum &&
          date.getMonth() === monthNum - 1 &&
          date.getFullYear() === yearNum) {
          form.fechaNacimiento = date;
        } else {
          $q.notify({ type: "warning", message: "Fecha inválida. Use formato DD/MM/AAAA" });
          manualDateInput.value = "";
        }
      } else {
        $q.notify({ type: "warning", message: "Fecha inválida. Use formato DD/MM/AAAA" });
        manualDateInput.value = "";
      }
    }
  } else {
    $q.notify({ type: "warning", message: "Formato inválido. Use DD/MM/AAAA" });
    manualDateInput.value = "";
  }
};

// Watch for changes in form.fechaNacimiento to sync with manual input
watch(
  () => form.fechaNacimiento,
  (newDate) => {
    if (newDate) {
      const date = new Date(newDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      // Only update if different to avoid infinite loops
      if (manualDateInput.value !== formattedDate) {
        manualDateInput.value = formattedDate;
      }
    } else {
      manualDateInput.value = "";
    }
  }
);

watch(
  () => props.patient,
  (newPatient) => {
    Object.keys(form).forEach((key) => {
      const typedKey = key as keyof PatientType;
      if (typedKey === 'id_paciente') form.id_paciente = 0;
      else if (typedKey === 'imagen' || typedKey === 'imagen2') (form as any)[typedKey] = null;
      else if (typedKey === 'imagenes') form.imagenes = [];
      else (form as any)[typedKey] = undefined;
    });

    if (newPatient) {
      Object.assign(form, newPatient);
      form.id_medico = newPatient.id_medico;
      if (newPatient.fechaNacimiento) {
        const raw = newPatient.fechaNacimiento;
        const normalized = typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw)
          ? raw + 'T00:00:00'
          : raw;
        const d = new Date(normalized);
        form.fechaNacimiento = d;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        manualDateInput.value = `${day}/${month}/${d.getFullYear()}`;
      } else {
        manualDateInput.value = '';
      }
      form.imagen = null;
      form.imagen2 = null;
    } else {
      form.id_medico = authStore.user?.medico?.id_medico;
      form.fechaNacimiento = undefined;
    }
  },
  { immediate: true, deep: true }
);

// *** CAMBIO AQUÍ: Watch para calcular el IMC automáticamente ***
watch(
  [() => form.examenFisicoPeso, () => form.examenFisicoTalla],
  ([peso, talla]) => {
    const pesoNum = typeof peso === 'number' ? peso : undefined;
    const tallaNum = typeof talla === 'number' ? talla : undefined;

    if (pesoNum && pesoNum > 0 && tallaNum && tallaNum > 0) {
      // Convertir talla de cm a metros
      const tallaMetros = tallaNum / 100;
      // Calcular IMC: peso / (altura_m * altura_m)
      const imc = pesoNum / (tallaMetros * tallaMetros);
      // Asignar al formulario, redondeado a 2 decimales
      form.examenFisicoIMC = parseFloat(imc.toFixed(2));
    } else {
      // Si no hay peso o talla válidos, limpiar el campo IMC
      form.examenFisicoIMC = undefined;
    }
  }
);
// *** FIN DEL CAMBIO ***

const handleSubmit = async () => {
  if (!isReadOnly.value) {
    $q.notify({ type: "warning", message: "No tiene permiso para editar este paciente." });
    return;
  }

  loading.value = true;
  const medicoIdLogueado = authStore.getMedicoId;
  const formData = new FormData();

  for (const key in form) {
    const typedKey = key as keyof PatientType;
    if (typedKey === "imagenes" || typedKey === 'edad' || (props.isEdit && typedKey === 'id_paciente')) continue;
    const value = form[typedKey];
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(typedKey, value, value.name);
      } else if (typedKey === "fechaNacimiento" && value instanceof Date) {
        formData.append(typedKey, value.toISOString());
      } else if (typedKey !== 'imagen' && typedKey !== 'imagen2') {
        formData.append(typedKey, String(value));
      }
    }
  }

  if (props.isEdit && form.id_medico !== undefined) {
    formData.set('id_medico', String(form.id_medico));
  } else if (!props.isEdit && medicoIdLogueado !== null) {
    formData.set('id_medico', String(medicoIdLogueado));
  } else if (!props.isEdit && medicoIdLogueado === null) {
    $q.notify({ type: "negative", message: "Error: No se pudo identificar al médico." });
    loading.value = false;
    return;
  }

  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    if (props.isEdit && form.id_paciente) {
      await api.patch(`/paciente/actualizar/${form.id_paciente}`, formData, config);
      $q.notify({ type: "positive", message: "Paciente actualizado!" });
    } else {
      await api.post("/paciente/crear", formData, config);
      $q.notify({ type: "positive", message: "Paciente creado!" });
    }

    // Emitir evento después de guardar exitosamente
    emit("saved");
  } catch (error: any) {
    console.error("Error saving patient:", error.response?.data || error);
    $q.notify({
      type: "negative",
      message: error.response?.data?.message || "Error al guardar.",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Card improvements */
.q-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Form inputs improvements */
::v-deep .q-field {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

::v-deep .q-field:focus-within {
  opacity: 1;
}

::v-deep .q-field__input {
  border-radius: 6px;
  transition: all 0.3s ease;
}

/* Expansion items improvements */
.expansion-style {
  border-radius: 8px !important;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: rgba(0, 0, 0, 0.01) !important;
}

.expansion-style:hover {
  background-color: rgba(0, 0, 0, 0.02) !important;
}

.expansion-style :deep(.q-expansion-item__container) {
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expansion-style :deep(.q-expansion-item__content) {
  background: var(--app-white);
  border-radius: 0 0 8px 8px;
  padding: 12px;
}

.expansion-style :deep(.q-tab) {
  padding: 0 12px;
  min-height: 32px;
  transition: all 0.3s ease;
}

.expansion-style :deep(.q-tab__label) {
  font-size: 0.875rem;
  font-weight: 500;
}

.expansion-style :deep(.q-separator) {
  margin: 8px 0;
  opacity: 0.3;
}

/* Button styling */
::v-deep .q-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
}

::v-deep .q-btn:hover {
  transform: translateY(-2px);
}

.cursor-not-allowed {
  cursor: not-allowed !important;
}

/* Icon improvements */
::v-deep .q-icon {
  transition: color 0.3s ease, opacity 0.3s ease;
}

/* Text improvements */
.text-h6 {
  letter-spacing: -0.3px;
  font-weight: 600;
}
</style>
