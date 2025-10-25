<template>
  <q-card class="q-ma-sm full-width">
    <q-card-section class="q-pb-none">
      <div class="text-h6 text-primary">
        <q-icon name="person_add" class="q-mr-sm" />
        {{ isEdit ? "Editar Paciente" : "Nuevo Paciente" }}
      </div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="handleSubmit" class="q-gutter-sm">
        <div class="row q-col-gutter-xs items-center">
          <div class="col-12 col-sm-6">
            <q-input dense outlined v-model="form.nombre" label="Nombres"
              :rules="[(val) => !!val || 'Nombres requeridos']" :disable="!isReadOnly" />
          </div>
          <div class="col-12 col-sm-6">
            <q-input dense outlined v-model="form.apellido" label="Apellidos"
              :rules="[(val) => !!val || 'Apellidos requeridos']" :disable="!isReadOnly" />
          </div>
        </div>

        <div class="row q-col-gutter-xs items-center">
          <div class="col-12 col-sm-4">
            <q-input dense outlined v-model="form.dni" label="DNI/Cédula" hint="Opcional" :disable="!isReadOnly" />
          </div>
          <div class="col-12 col-sm-4">
            <v-date-picker v-model="fechaNacimientoModel" :model-config="{ type: 'string', mask: 'YYYY-MM-DD' }"
              :input-props="{
                class: 'q-field__native q-placeholder full-width',
                placeholder: 'Seleccione una fecha',
              }" :is-required="false" :masks="{
                input: 'DD/MM/YYYY'
              }" class="full-width">
              <template v-slot="{ inputValue, inputEvents }">
                <q-input dense outlined :model-value="inputValue" v-on="inputEvents" label="Fecha de Nacimiento"
                  hint="Opcional">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" />
                  </template>
                </q-input>
              </template>
            </v-date-picker>
          </div>
          <div class="col-12 col-sm-4">
            <q-select dense outlined v-model="form.sexo" label="Sexo" :options="genderOptions" hint="Opcional"
              emit-value map-options :disable="!isReadOnly" />
          </div>
        </div>

        <q-expansion-item group="form-sections" icon="contact_mail" label="Información de Contacto" dense-toggle
          class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
            <div class="row q-col-gutter-sm">
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
          </div>
        </q-expansion-item>

        <q-expansion-item group="form-sections" icon="person" label="Datos Personales" dense-toggle
          class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
            <div class="row q-col-gutter-sm">
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
          </div>
        </q-expansion-item>

        <q-expansion-item group="form-sections" icon="medical_information" label="Antecedentes Médicos" dense-toggle
          class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
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
            </div>
          </div>
        </q-expansion-item>

        <q-expansion-item group="form-sections" icon="monitor_heart" label="Examen Físico" dense-toggle
          class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
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
          </div>
        </q-expansion-item>

        <q-expansion-item group="form-sections" icon="visibility" label="Observaciones" dense-toggle
          class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
            <q-input dense outlined v-model="form.primerObservacion" label="Primera Observación" type="textarea"
              rows="3" hint="Opcional" :disable="!isReadOnly" />
          </div>
        </q-expansion-item>

        <q-expansion-item group="form-sections" icon="science" label="Laboratorios" dense-toggle
          class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
            <q-input dense outlined v-model="form.laboratorios" label="Estudios de Laboratorio" type="textarea" rows="3"
              hint="Opcional" :disable="!isReadOnly" />
          </div>
        </q-expansion-item>

        <q-expansion-item group="form-sections" icon="attach_file" label="Archivos Adjuntos" dense-toggle
          class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-file dense outlined v-model="form.imagen" label="Imagen 1" hint="Opcional" :disable="!isReadOnly" />
              </div>
              <div class="col-12 col-sm-6">
                <q-file dense outlined v-model="form.imagen2" label="Imagen 2" hint="Opcional" :disable="!isReadOnly" />
              </div>
            </div>
          </div>
        </q-expansion-item>

        <q-card-actions align="right" class="q-pt-md">
          <q-btn flat dense color="grey-7" label="Cancelar" @click="$emit('cancel')" />
          <q-btn dense type="submit" color="primary" :label="isEdit ? 'Actualizar' : 'Crear'" :loading="loading"
            :disable="!isReadOnly" />
        </q-card-actions>
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
const activeSystemTab = ref("nervous");

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
    if (!form.fechaNacimiento) return "";
    try {
      const date = new Date(form.fechaNacimiento);
      const offset = date.getTimezoneOffset();
      const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
      return adjustedDate.toISOString().split("T")[0];
    } catch (e) {
      return "";
    }
  },
  set(newValue: string) {
    form.fechaNacimiento = newValue ? new Date(newValue) : undefined;
  },
});

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
        form.fechaNacimiento = new Date(newPatient.fechaNacimiento);
      }
      form.imagen = null;
      form.imagen2 = null;
    } else {
      form.id_medico = authStore.user?.medico?.id_medico;
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
.expansion-style :deep(.q-expansion-item__container) {
  border-radius: 8px;
  margin-bottom: 8px;
}

.expansion-style :deep(.q-expansion-item__content) {
  background: var(--app-white);
}

.expansion-style :deep(.q-tab) {
  padding: 0 12px;
  min-height: 32px;
}

.expansion-style :deep(.q-tab__label) {
  font-size: 0.875rem;
}

.expansion-style :deep(.q-separator) {
  margin: 8px 0;
}

.cursor-not-allowed {
  cursor: not-allowed !important;
}
</style>
