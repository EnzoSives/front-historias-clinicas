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
              :rules="[(val) => !!val || 'Nombres requeridos']" />
          </div>
          <div class="col-12 col-sm-6">
            <q-input dense outlined v-model="form.apellido" label="Apellidos"
              :rules="[(val) => !!val || 'Apellidos requeridos']" />
          </div>
        </div>

        <div class="row q-col-gutter-xs items-center">
          <div class="col-12 col-sm-4">
            <q-input dense outlined v-model="form.dni" label="DNI/Cédula"
              :rules="[(val) => !!val || 'DNI requerido']" />
          </div>
          <div class="col-12 col-sm-4">
            <q-input dense outlined v-model="fechaNacimientoModel" label="Fecha de Nacimiento"
              :rules="[(val) => !!val || 'Fecha de nacimiento requerida']" readonly hint="Seleccione una fecha">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="fechaNacimientoModel">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-4">
            <q-select dense outlined v-model="form.sexo" label="Sexo" :options="genderOptions"
              :rules="[(val) => !!val || 'Sexo requerido']" emit-value map-options />
          </div>
        </div>

        <q-expansion-item group="form-sections" icon="contact_mail" label="Información de Contacto" default-opened
          dense-toggle class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-input dense outlined v-model="form.direccion" label="Dirección"
                  :rules="[(val) => !!val || 'Dirección requerida']" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.telefonoCelular" label="Teléfono Celular" hint="Opcional" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.telefonoFijo" label="Teléfono Fijo" hint="Opcional" />
              </div>
            </div>
          </div>
        </q-expansion-item>

        <q-expansion-item group="form-sections" icon="person" label="Datos Personales" dense-toggle
          class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.ocupacion" label="Ocupación" hint="Opcional" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.estadoCivil" label="Estado Civil" hint="Opcional" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.obraSocial" label="Obra Social" hint="Opcional" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.afiliadoObraSocial" label="Afiliado Obra Social"
                  hint="Opcional" />
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
                  type="textarea" rows="2" hint="Opcional" />
              </div>
              <div class="col-12">
                <q-input dense outlined v-model="form.antecedentesQuirurgicos" label="Antecedentes Quirúrgicos"
                  type="textarea" rows="2" hint="Opcional" />
              </div>
              <div class="col-12">
                <q-input dense outlined v-model="form.alergias" label="Alergias" type="textarea" rows="2"
                  hint="Opcional" />
              </div>
              <div class="col-12">
                <q-input dense outlined v-model="form.medicacionHabitual" label="Medicamentos Habituales"
                  type="textarea" rows="2" hint="Opcional" />
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
                  hint="Opcional" />
              </div>
              <div class="col-12 col-sm-3">
                <q-input dense outlined v-model.number="form.examenFisicoTalla" label="Talla (cm)" type="number"
                  hint="Opcional" />
              </div>
              <div class="col-12 col-sm-3">
                <q-input dense outlined v-model.number="form.examenFisicoIMC" label="IMC" type="number"
                  hint="Opcional" />
              </div>
              <div class="col-12 col-sm-3">
                <q-input dense outlined v-model="form.examenFisicoTemperatura" label="Temp. (°C)" hint="Opcional" />
              </div>
            </div>

            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-12 col-sm-4">
                <q-input dense outlined v-model="form.examenFisicoTA" label="T.A." hint="Opcional" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input dense outlined v-model="form.examenFisicoFC" label="F.C." hint="Opcional" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input dense outlined v-model="form.examenFisicoFR" label="F.R." hint="Opcional" />
              </div>
            </div>

            <q-separator class="q-my-sm" />

            <q-tabs v-model="activeSystemTab" dense class="text-grey" active-color="primary" indicator-color="primary"
              align="justify" narrow-indicator>
              <q-tab name="nervous" label="Nervioso" />
              <q-tab name="cardio" label="Cardiovascular" />
              <q-tab name="respiratory" label="Respiratorio" />
              <q-tab name="digestive" label="Digestivo" />
            </q-tabs>

            <q-tab-panels v-model="activeSystemTab" animated>
              <q-tab-panel name="nervous" class="q-pa-none q-pt-sm">
                <q-input dense outlined v-model="form.examenFisicoSistemaNervioso" label="Sistema Nervioso"
                  type="textarea" rows="2" hint="Opcional" />
              </q-tab-panel>
              <q-tab-panel name="cardio" class="q-pa-none q-pt-sm">
                <q-input dense outlined v-model="form.examenFisicoAPCardiovascular" label="Sistema Cardiovascular"
                  type="textarea" rows="2" hint="Opcional" />
              </q-tab-panel>
              <q-tab-panel name="respiratory" class="q-pa-none q-pt-sm">
                <q-input dense outlined v-model="form.examenFisicoAPRespiratorio" label="Sistema Respiratorio"
                  type="textarea" rows="2" hint="Opcional" />
              </q-tab-panel>
              <q-tab-panel name="digestive" class="q-pa-none q-pt-sm">
                <q-input dense outlined v-model="form.examenFisicoAPDigestivo" label="Sistema Digestivo" type="textarea"
                  rows="2" hint="Opcional" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </q-expansion-item>

        <q-expansion-item group="form-sections" icon="attach_file" label="Archivos Adjuntos" dense-toggle
          class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-file dense outlined v-model="form.imagen" label="Imagen 1" hint="Opcional" />
              </div>
              <div class="col-12 col-sm-6">
                <q-file dense outlined v-model="form.imagen2" label="Imagen 2" hint="Opcional" />
              </div>
            </div>
          </div>
        </q-expansion-item>

        <q-card-actions align="right" class="q-pt-md">
          <q-btn flat dense color="grey-7" label="Cancelar" @click="$emit('cancel')" />
          <q-btn dense type="submit" color="primary" :label="isEdit ? 'Actualizar' : 'Crear'" :loading="loading" />
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

// Esta propiedad computada funciona perfecto con el nuevo QInput+QDate
const fechaNacimientoModel = computed({
  get() {
    if (!form.fechaNacimiento) return "";
    try {
      const date = new Date(form.fechaNacimiento);
      // Corregir el problema de la zona horaria que puede restar un día
      const offset = date.getTimezoneOffset();
      const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
      return adjustedDate.toISOString().split("T")[0];
    } catch (e) {
      return "";
    }
  },
  set(newValue: string) {
    if (!newValue) {
      form.fechaNacimiento = undefined;
    } else {
      // El nuevo valor del input (string) se convierte a un objeto Date
      // QDate y el input type="date" usan 'YYYY-MM-DD' o 'YYYY/MM/DD'
      // new Date() maneja ambos formatos correctamente.
      form.fechaNacimiento = new Date(newValue);
    }
  },
});

watch(
  () => props.patient,
  (newPatient) => {
    if (newPatient) {
      Object.assign(form, newPatient);
      if (newPatient.fechaNacimiento) {
        form.fechaNacimiento = new Date(newPatient.fechaNacimiento);
      }
    } else {
      Object.keys(form).forEach((key) => ((form as any)[key] = undefined));
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
    if (key === "imagenes") continue;
    if (props.isEdit && key === "id_paciente") continue;

    const value = (form as any)[key];
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (key === "fechaNacimiento" && value instanceof Date) {
        // Aseguramos que se envíe en formato ISO
        formData.append(key, value.toISOString());
      } else if (key !== "imagen" && key !== "imagen2") {
        formData.append(key, String(value));
      }
    }
  }

  if (medicoId) {
    formData.set("id_medico", String(medicoId));
  }

  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    if (props.isEdit && form.id_paciente) {
      await api.patch(
        `http://localhost:3000/paciente/actualizar/${form.id_paciente}`,
        formData,
        config
      );
      $q.notify({
        type: "positive",
        message: "Paciente actualizado exitosamente!",
      });
    } else {
      await api.post(
        "http://localhost:3000/paciente/crear",
        formData,
        config
      );
      $q.notify({
        type: "positive",
        message: "Paciente creado exitosamente!",
      });
    }

    emit("saved");
  } catch (error: any) {
    console.error("Error saving patient:", error.response || error);
    $q.notify({
      type: "negative",
      message:
        error.response?.data?.message ||
        "Error al guardar el paciente. Intente nuevamente.",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 4. CSS de 'compact-form' y 'mini-field' ELIMINADO */

/* Estos estilos son para los QExpansionItem y QTabs, están bien */
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
</style>