<template>
    <div class="q-pa-md">

        <!-- ── Header ──────────────────────────────────────────────── -->
        <div class="q-mb-md">
            <div class="text-h5 text-primary text-weight-bold row items-center no-wrap q-mb-xs">
                <q-icon name="event_note" size="1.4rem" class="q-mr-sm" />
                Turnos
            </div>
            <!-- Stats: horizontally scrollable on mobile -->
            <div class="stats-scroll row no-wrap q-gutter-xs">
                <q-chip square color="primary" text-color="white" icon="calendar_today"
                    :size="$q.screen.xs ? 'sm' : 'md'">
                    <span class="text-weight-bold q-mr-xs">{{ stats.hoy }}</span>
                    <span>Hoy</span>
                </q-chip>
                <q-chip square color="teal" text-color="white" icon="date_range" :size="$q.screen.xs ? 'sm' : 'md'">
                    <span class="text-weight-bold q-mr-xs">{{ stats.semana }}</span>
                    <span>Semana</span>
                </q-chip>
                <q-chip square color="amber-5" text-color="white" icon="pending_actions"
                    :size="$q.screen.xs ? 'sm' : 'md'">
                    <span class="text-weight-bold q-mr-xs">{{ stats.pendientes }}</span>
                    <span>Pendientes</span>
                </q-chip>
                <q-chip square color="green" text-color="white" icon="check_circle" :size="$q.screen.xs ? 'sm' : 'md'">
                    <span class="text-weight-bold q-mr-xs">{{ stats.completados }}</span>
                    <span>Completados</span>
                </q-chip>
                <q-chip square color="red-6" text-color="white" icon="cancel" :size="$q.screen.xs ? 'sm' : 'md'"
                    v-if="stats.cancelados > 0">
                    <span class="text-weight-bold q-mr-xs">{{ stats.tasaCancelacion }}%</span>
                    <span>Cancelados</span>
                    <q-tooltip>{{ stats.cancelados }} turno{{ stats.cancelados !== 1 ? 's' : '' }} cancelado{{
                        stats.cancelados !== 1 ? 's' : '' }} esta semana</q-tooltip>
                </q-chip>
            </div>
        </div>

        <!-- ── Main grid ───────────────────────────────────────────── -->
        <div class="row q-col-gutter-md">

            <!-- Left: calendar -->
            <div class="col-12 col-md-4">
                <!-- Mobile toggle -->
                <div v-if="$q.screen.xs" class="q-mb-sm">
                    <q-btn flat dense no-caps :icon="calendarExpanded ? 'expand_less' : 'date_range'"
                        :label="calendarExpanded ? 'Ocultar calendario' : 'Ver calendario'" color="primary"
                        class="full-width" style="border: 1px solid #e0e0e0; border-radius: 4px"
                        @click="calendarExpanded = !calendarExpanded" />
                </div>

                <transition name="slide-calendar">
                    <div v-show="!$q.screen.xs || calendarExpanded">
                        <q-card flat bordered class="q-mb-md">
                            <v-calendar :attributes="calendarAttributes" @dayclick="handleDayClick"
                                title-position="left" expanded class="custom-calendar" />
                        </q-card>

                        <!-- Week view summary -->
                        <q-card flat bordered v-if="weekView">
                            <q-card-section class="q-py-sm q-px-md">
                                <div class="text-caption text-weight-medium text-grey-7 q-mb-xs">Semana actual</div>
                                <div class="row q-col-gutter-xs">
                                    <div v-for="day in weekDays" :key="day.iso" class="col" style="cursor:pointer"
                                        @click="selectedDate = day.date; if ($q.screen.xs) calendarExpanded = false">
                                        <div :class="['text-center q-pa-xs rounded-borders week-day-cell',
                                            day.isSelected ? 'bg-primary text-white' : 'bg-grey-2 text-grey-8',
                                            day.isToday && !day.isSelected ? 'week-day-today' : '']">
                                            <div class="text-caption text-weight-bold row justify-center items-center no-wrap"
                                                style="gap:2px">
                                                {{ day.label }}
                                                <q-icon v-if="day.isToday" name="circle" size="5px"
                                                    :color="day.isSelected ? 'white' : 'primary'" />
                                            </div>
                                            <div class="text-caption">{{ day.count }}</div>
                                        </div>
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                </transition>
            </div>

            <!-- Right: day appointments -->
            <div class="col-12 col-md-8">
                <q-card flat bordered>

                    <!-- Header row 1: date nav + action buttons -->
                    <q-card-section class="q-py-sm q-px-sm q-px-md-md">
                        <div class="row items-center justify-between q-col-gutter-xs">
                            <!-- Date navigation -->
                            <div class="col-12 col-sm-auto row items-center q-gutter-xs no-wrap">
                                <q-btn flat round dense icon="chevron_left" color="grey-7" size="sm" @click="prevDay">
                                    <q-tooltip>Día anterior</q-tooltip>
                                </q-btn>
                                <div class="text-subtitle1 text-weight-medium">
                                    {{ $q.screen.xs ? formattedDateShort : formattedDate }}
                                </div>
                                <q-btn flat round dense icon="chevron_right" color="grey-7" size="sm" @click="nextDay">
                                    <q-tooltip>Día siguiente</q-tooltip>
                                </q-btn>
                                <q-btn flat dense label="Hoy" color="primary" size="xs" @click="goToday"
                                    v-if="!isToday" />
                            </div>
                            <!-- Action buttons -->
                            <div class="col-12 col-sm-auto row items-center justify-end q-gutter-xs">
                                <!-- Secondary actions: visible on sm+ -->
                                <template v-if="$q.screen.gt.xs">
                                    <q-btn flat :icon="weekView ? 'view_day' : 'view_week'" color="grey-7" size="sm"
                                        @click="weekView = !weekView">
                                        <q-tooltip>{{ weekView ? 'Ocultar semana' : 'Ver semana' }}</q-tooltip>
                                    </q-btn>
                                    <q-btn flat icon="schedule" label="Horarios" color="grey-7" size="sm"
                                        @click="showHorariosDialog = true" />
                                    <q-btn flat icon="download" color="grey-7" size="sm" @click="exportCSV">
                                        <q-tooltip>Exportar CSV</q-tooltip>
                                    </q-btn>
                                    <q-btn flat icon="print" color="grey-7" size="sm" @click="printTurnos">
                                        <q-tooltip>Imprimir turnos del día</q-tooltip>
                                    </q-btn>
                                </template>
                                <!-- Mobile: secondary actions in dropdown -->
                                <q-btn v-else flat round dense icon="more_vert" color="grey-7" size="sm">
                                    <q-tooltip>Más opciones</q-tooltip>
                                    <q-menu auto-close>
                                        <q-list dense style="min-width: 180px">
                                            <q-item clickable @click="weekView = !weekView">
                                                <q-item-section avatar>
                                                    <q-icon :name="weekView ? 'view_day' : 'view_week'" color="grey-7"
                                                        size="16px" />
                                                </q-item-section>
                                                <q-item-section class="text-body2">
                                                    <span v-if="weekView">Ocultar semana</span>
                                                    <span v-else>Ver semana</span>
                                                </q-item-section>
                                            </q-item>
                                            <q-item clickable @click="showHorariosDialog = true">
                                                <q-item-section avatar>
                                                    <q-icon name="schedule" color="grey-7" size="16px" />
                                                </q-item-section>
                                                <q-item-section class="text-body2">Horarios</q-item-section>
                                            </q-item>
                                            <q-item clickable @click="exportCSV">
                                                <q-item-section avatar>
                                                    <q-icon name="download" color="grey-7" size="16px" />
                                                </q-item-section>
                                                <q-item-section class="text-body2">Exportar CSV</q-item-section>
                                            </q-item>
                                            <q-item clickable @click="printTurnos">
                                                <q-item-section avatar>
                                                    <q-icon name="print" color="grey-7" size="16px" />
                                                </q-item-section>
                                                <q-item-section class="text-body2">Imprimir</q-item-section>
                                            </q-item>
                                        </q-list>
                                    </q-menu>
                                </q-btn>
                                <q-btn outline color="primary" icon="person_add"
                                    :label="$q.screen.gt.xs ? 'Paciente' : undefined" @click="showPatientDialog = true">
                                    <q-tooltip v-if="$q.screen.xs">Agregar paciente</q-tooltip>
                                </q-btn>
                                <q-btn color="primary" icon="add" :label="$q.screen.gt.xs ? 'Nuevo turno' : undefined"
                                    @click="openAddDialog" :disable="horariosDelDia.length === 0 || !!feriadoDelDia">
                                    <q-tooltip>{{ horariosDelDia.length === 0 ? 'Configurá una franja horaria primero' :
                                        feriadoDelDia ? `Feriado:
                                        ${feriadoDelDia}` : 'Nuevo turno' }}</q-tooltip>
                                </q-btn>
                            </div>
                        </div>
                    </q-card-section>

                    <!-- Header row 2: counters + search + confirm all -->
                    <q-card-section class="q-pt-none q-pb-sm q-px-md">
                        <div class="row items-center justify-between q-mb-xs">
                            <div class="row items-center q-gutter-xs">
                                <q-badge outline color="grey-7"
                                    :label="`${turnosActivosDia} / ${maxTurnosDia > 0 ? maxTurnosDia : '∞'} turnos`" />
                                <q-badge v-if="sobreturnos > 0" color="amber-5"
                                    :label="`${sobreturnos} sobreturno${sobreturnos > 1 ? 's' : ''}`" />
                                <q-badge
                                    v-if="slotsLibres > 0 && sobreturnos === 0 && maxTurnosDia > 0 && !feriadoDelDia"
                                    outline color="green-7"
                                    :label="`${slotsLibres} libre${slotsLibres !== 1 ? 's' : ''}`" />
                                <q-badge v-if="horariosDelDia.length === 0" color="grey-5"
                                    label="Sin horario configurado" />
                                <q-badge v-if="feriadoDelDia" color="red-4" icon="celebration" :label="feriadoDelDia" />
                            </div>
                            <div class="row items-center q-gutter-xs">
                                <q-btn v-if="pendientesDia > 0" flat dense icon="done_all" color="teal" size="xs"
                                    :label="`Confirmar ${pendientesDia}`" @click="confirmAll">
                                    <q-tooltip>Confirmar todos los turnos pendientes del día</q-tooltip>
                                </q-btn>
                                <div class="row items-center q-gutter-xs text-caption text-grey-6"
                                    v-if="horariosDelDia.length > 0">
                                    <q-icon name="access_time" size="12px" />
                                    <span v-for="(h, i) in horariosDelDia" :key="h.id">
                                        {{ h.horaInicio.slice(0, 5) }}–{{ h.horaFin.slice(0, 5) }}
                                        ({{ h.duracionMinutos }}min){{ i < horariosDelDia.length - 1 ? ' ·' : '' }}
                                            </span>
                                </div>
                            </div>
                        </div>
                        <q-linear-progress v-if="maxTurnosDia > 0" rounded size="5px" class="q-mt-xs"
                            :value="Math.min(turnosActivosDia / maxTurnosDia, 1)"
                            :color="sobreturnos > 0 ? 'amber-5' : turnosActivosDia >= maxTurnosDia ? 'green' : 'primary'" />
                    </q-card-section>

                    <q-separator />

                    <q-banner v-if="feriadoDelDia" class="bg-red-1 text-red-9" rounded>
                        <template v-slot:avatar>
                            <q-icon name="celebration" color="red-7" />
                        </template>
                        <span class="text-weight-medium">{{ feriadoDelDia }}</span><br />
                        <span class="text-caption">No se pueden cargar turnos en días feriados.</span>
                    </q-banner>

                    <q-list separator>
                        <q-item v-if="appointmentStore.loading">
                            <q-item-section class="text-center q-py-lg">
                                <q-spinner-dots color="primary" size="30px" />
                            </q-item-section>
                        </q-item>
                        <q-item v-else-if="filteredTurnos.length === 0">
                            <q-item-section class="text-center text-grey-5 q-py-xl">

                                <div class="text-caption">{{ turnoSearch.trim() ? `Sin resultados para "${turnoSearch}"`
                                    : 'No hay turnos para este día' }}</div>
                            </q-item-section>
                        </q-item>

                        <q-item v-for="(turno, idx) in filteredTurnos" :key="turno.id_turno" :class="['turno-item q-py-xs q-px-md',
                            isSobreturno(idx) ? 'sobreturno-item' : '',
                            isProximo(turno) ? 'proximo-item' : '']">
                            <q-item-section avatar style="min-width: 40px">
                                <q-avatar size="34px" :color="isSobreturno(idx) ? 'amber-5' : statusColor(turno.estado)"
                                    text-color="white" class="text-caption text-weight-bold">
                                    {{ initials(turno.paciente) }}
                                </q-avatar>
                                <q-badge v-if="isProximo(turno)" floating color="blue-6" label="próximo" />
                            </q-item-section>

                            <q-item-section>
                                <q-item-label class="text-body2 text-weight-medium">
                                    {{ turno.paciente.apellido }} {{ turno.paciente.nombre }}
                                    <q-chip v-if="getPatient(turno.id_paciente)?.obraSocial" dense size="xs"
                                        color="blue-1" text-color="blue-8" class="q-ml-xs q-px-xs" style="height:16px">
                                        {{ getPatient(turno.id_paciente)?.obraSocial }}
                                    </q-chip>
                                </q-item-label>
                                <q-item-label caption class="row items-center q-gutter-xs">
                                    <q-icon name="access_time" size="11px" />
                                    <span>{{ formatTime(turno.fechaHora) }}</span>
                                    <span v-if="turno.motivo" class="text-grey-6">· {{ turno.motivo }}</span>
                                    <q-badge v-if="isProximo(turno) && tiempoRestante(turno)" color="blue-6"
                                        class="q-ml-xs" style="font-size:10px">
                                        {{ tiempoRestante(turno) }}
                                    </q-badge>
                                </q-item-label>
                                <q-item-label v-if="turno.notas" caption class="text-grey-5 q-mt-xs">
                                    <q-icon name="notes" size="11px" class="q-mr-xs" />{{ turno.notas }}
                                </q-item-label>
                            </q-item-section>

                            <q-item-section side class="row items-center no-wrap q-gutter-xs">
                                <q-badge :color="isSobreturno(idx) ? 'amber-5' : statusColor(turno.estado)"
                                    :label="$q.screen.xs ? undefined : (isSobreturno(idx) ? 'sobreturno' : turno.estado)">
                                    <q-tooltip v-if="$q.screen.xs">{{ isSobreturno(idx) ? 'Sobreturno' : turno.estado
                                        }}</q-tooltip>
                                </q-badge>
                                <q-btn flat round dense icon="more_vert" size="xs" color="grey-6">
                                    <q-menu auto-close>
                                        <q-list dense style="min-width: 170px">
                                            <q-item clickable @click="openEditDialog(turno)">
                                                <q-item-section avatar>
                                                    <q-icon name="edit" color="primary" size="16px" />
                                                </q-item-section>
                                                <q-item-section class="text-body2">Editar turno</q-item-section>
                                            </q-item>
                                            <q-separator />
                                            <q-item-label header class="text-caption text-grey-6 q-py-xs">Cambiar
                                                estado</q-item-label>
                                            <q-item v-for="opt in statusOptions" :key="opt.value" clickable
                                                :disable="turno.estado === opt.value"
                                                @click="changeStatus(turno.id_turno, opt.value)">
                                                <q-item-section avatar>
                                                    <q-icon :name="opt.icon" :color="opt.color" size="16px" />
                                                </q-item-section>
                                                <q-item-section class="text-body2">{{ opt.label }}</q-item-section>
                                            </q-item>
                                            <q-separator />
                                            <q-item clickable @click="deleteTurno(turno.id_turno)">
                                                <q-item-section avatar>
                                                    <q-icon name="delete" color="negative" size="16px" />
                                                </q-item-section>
                                                <q-item-section
                                                    class="text-negative text-body2">Eliminar</q-item-section>
                                            </q-item>
                                        </q-list>
                                    </q-menu>
                                </q-btn>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card>
            </div>
        </div>

        <!-- ── Hidden print table ──────────────────────────────── -->
        <div id="print-turnos" style="display:none">
            <h2 style="font-family:sans-serif;margin:0 0 4px">Turnos — {{ formattedDate }}</h2>
            <p style="font-family:sans-serif;font-size:12px;color:#555;margin:0 0 12px">
                {{ turnosActivosDia }} turno{{ turnosActivosDia !== 1 ? 's' : '' }}
                <span v-if="sobreturnos > 0"> · {{ sobreturnos }} sobreturno{{ sobreturnos > 1 ? 's' : '' }}</span>
            </p>
            <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:13px">
                <thead>
                    <tr style="background:#1976d2;color:#fff">
                        <th style="padding:8px 12px;text-align:left;width:70px">Horario</th>
                        <th style="padding:8px 12px;text-align:left">Nombre</th>
                        <th style="padding:8px 12px;text-align:left">Obra social</th>
                        <th style="padding:8px 12px;text-align:left;width:110px">Teléfono</th>
                        <th style="padding:8px 12px;text-align:left">Motivo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(turno, idx) in appointmentsForSelectedDate.filter(t => t.estado !== 'cancelado')"
                        :key="turno.id_turno" :style="idx % 2 === 0 ? 'background:#f5f5f5' : 'background:#fff'">
                        <td style="padding:7px 12px;border-bottom:1px solid #e0e0e0">{{ formatTime(turno.fechaHora) }}
                        </td>
                        <td style="padding:7px 12px;border-bottom:1px solid #e0e0e0">{{ turno.paciente.apellido }} {{
                            turno.paciente.nombre }}</td>
                        <td style="padding:7px 12px;border-bottom:1px solid #e0e0e0">{{
                            getPatient(turno.id_paciente)?.obraSocial ?? '—' }}</td>
                        <td style="padding:7px 12px;border-bottom:1px solid #e0e0e0">{{
                            getPatient(turno.id_paciente)?.telefonoCelular ??
                            getPatient(turno.id_paciente)?.telefonoFijo ?? '—' }}</td>
                        <td style="padding:7px 12px;border-bottom:1px solid #e0e0e0">{{ turno.motivo ?? '—' }}</td>
                    </tr>
                    <tr v-if="appointmentsForSelectedDate.filter(t => t.estado !== 'cancelado').length === 0">
                        <td colspan="5" style="padding:12px;text-align:center;color:#999">Sin turnos para esta fecha.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- ── Edit Turno Dialog ───────────────────────────────── -->
        <q-dialog v-model="showEditDialog">
            <q-card style="width: min(420px, 95vw); max-width: 95vw">
                <q-form @submit.prevent="saveEditTurno">
                    <q-card-section class="row items-center q-pb-none">
                        <div class="text-h6">Editar Turno</div>
                        <q-space />
                        <q-btn icon="close" flat round dense v-close-popup />
                    </q-card-section>

                    <q-card-section class="q-gutter-md q-pt-md">
                        <q-select filled v-model="editForm.slot" :options="slotOptionsEdit" emit-value map-options
                            label="Horario" />
                        <q-input filled v-model="editForm.motivo" label="Motivo" autogrow type="textarea" rows="2" />
                        <q-input filled v-model="editForm.notas" label="Notas internas" autogrow type="textarea"
                            rows="2" />
                    </q-card-section>

                    <q-card-actions align="right" class="q-pa-md">
                        <q-btn flat label="Cancelar" v-close-popup />
                        <q-btn color="primary" label="Guardar cambios" type="submit"
                            :loading="appointmentStore.loading" />
                    </q-card-actions>
                </q-form>
            </q-card>
        </q-dialog>

        <!-- ── Add Turno Dialog ──────────────────────────────────── -->
        <q-dialog v-model="showAddDialog">
            <q-card style="width: min(420px, 95vw); max-width: 95vw">
                <q-form @submit.prevent="addTurno">
                    <q-card-section class="row items-center q-pb-none">
                        <div class="text-h6">Nuevo Turno</div>
                        <q-space />
                        <q-btn icon="close" flat round dense v-close-popup />
                    </q-card-section>
                    <q-card-section class="text-caption text-grey-6 q-pt-xs q-pb-none">
                        {{ formattedDate }}
                    </q-card-section>

                    <q-card-section class="q-gutter-md q-pt-md">
                        <q-select filled v-model="turnoForm.pacienteOpt" use-input hide-selected fill-input
                            input-debounce="0" :options="filteredPatientOptions" @filter="filterPatients"
                            label="Buscar paciente *" :rules="[val => !!val || 'Seleccione un paciente']">
                            <template v-slot:option="scope">
                                <q-item v-bind="scope.itemProps">
                                    <q-item-section>
                                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                                        <q-item-label caption v-if="scope.opt.sublabel">{{ scope.opt.sublabel
                                        }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </template>
                            <template v-slot:no-option="scope">
                                <q-item>
                                    <q-item-section class="text-grey-6 text-caption">
                                        No se encontraron pacientes.
                                    </q-item-section>
                                </q-item>
                                <q-separator />
                                <q-item clickable @click="openPatientFromTurno(scope.inputValue)">
                                    <q-item-section avatar>
                                        <q-icon name="person_add" color="primary" />
                                    </q-item-section>
                                    <q-item-section class="text-primary">
                                        Agregar "{{ scope.inputValue }}" como paciente
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>

                        <q-select filled v-model="turnoForm.slot" :options="slotOptions" emit-value map-options
                            label="Horario *" :rules="[val => !!val || 'Seleccione un horario']"
                            :hint="slotOptions.length === 0 ? 'No hay franjas configuradas para este día' : ''" />

                        <q-input filled v-model="turnoForm.motivo" label="Motivo (opcional)" autogrow type="textarea"
                            rows="2" />
                    </q-card-section>

                    <q-card-actions align="right" class="q-pa-md">
                        <q-btn flat label="Cancelar" v-close-popup />
                        <q-btn color="primary" label="Guardar turno" type="submit"
                            :loading="appointmentStore.loading" />
                    </q-card-actions>
                </q-form>
            </q-card>
        </q-dialog>

        <!-- ── Horarios Dialog ─────────────────────────────────────── -->
        <q-dialog v-model="showHorariosDialog" persistent>
            <q-card style="width: min(520px, 95vw); max-width: 95vw">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">Franjas horarias</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <!-- Existing franjas -->
                <q-card-section class="q-pt-sm">
                    <q-list bordered separator rounded>
                        <q-item v-if="appointmentStore.horarios.length === 0" class="text-grey-6 text-caption q-pa-sm">
                            No hay franjas configuradas.
                        </q-item>
                        <q-item v-for="h in appointmentStore.horarios" :key="h.id">
                            <q-item-section>
                                <q-item-label class="text-weight-medium">
                                    {{ DIAS[h.diaSemana] }}
                                    <q-badge color="primary" class="q-ml-xs"
                                        :label="`${h.horaInicio.slice(0, 5)} – ${h.horaFin.slice(0, 5)}`" />
                                </q-item-label>
                                <q-item-label caption>
                                    Slots de {{ h.duracionMinutos }} min · Máx {{ h.maxTurnosPorDia }} turnos
                                </q-item-label>
                            </q-item-section>
                            <q-item-section side class="row no-wrap q-gutter-xs">
                                <q-btn flat round dense icon="edit" size="sm" color="primary" @click="editHorario(h)">
                                    <q-tooltip>Editar</q-tooltip>
                                </q-btn>
                                <q-btn flat round dense icon="delete" size="sm" color="negative"
                                    @click="deleteHorario(h.id)">
                                    <q-tooltip>Eliminar</q-tooltip>
                                </q-btn>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>

                <q-separator />

                <!-- Add / Edit franja form -->
                <q-form @submit.prevent="saveHorario">
                    <q-card-section class="q-gutter-sm">
                        <div class="text-subtitle2 text-weight-medium q-mb-xs">
                            {{ editingHorarioId !== null ? 'Editar franja' : 'Nueva franja' }}
                        </div>
                        <div class="row q-col-gutter-sm">
                            <div class="col-12 col-sm-6">
                                <q-select filled dense v-model="horarioForm.diaSemana"
                                    :options="DIAS.map((d, i) => ({ label: d, value: i }))" emit-value map-options
                                    label="Día de la semana" />
                            </div>
                            <div class="col-6 col-sm-3">
                                <q-input filled dense v-model="horarioForm.horaInicio" type="time" label="Desde"
                                    @update:model-value="syncMaxTurnos" />
                            </div>
                            <div class="col-6 col-sm-3">
                                <q-input filled dense v-model="horarioForm.horaFin" type="time" label="Hasta"
                                    @update:model-value="syncMaxTurnos" />
                            </div>
                            <div class="col-6">
                                <q-input filled dense v-model.number="horarioForm.duracionMinutos" type="number" min="5"
                                    label="Duración slot (min)" @update:model-value="syncMaxTurnos" />
                            </div>
                            <div class="col-6">
                                <q-input filled dense v-model.number="horarioForm.maxTurnosPorDia" type="number" min="1"
                                    label="Turnos por franja">
                                    <template v-slot:hint>
                                        <span class="text-caption text-grey-6">
                                            Calculado: {{ calculatedMaxTurnos }} · editable
                                        </span>
                                    </template>
                                    <template v-slot:append>
                                        <q-btn flat round dense icon="autorenew" size="xs" color="primary"
                                            @click="syncMaxTurnos">
                                            <q-tooltip>Recalcular</q-tooltip>
                                        </q-btn>
                                    </template>
                                </q-input>
                            </div>
                        </div>
                    </q-card-section>
                    <q-card-actions align="right" class="q-pa-md q-pt-none">
                        <q-btn v-if="editingHorarioId !== null" flat label="Cancelar edición" @click="openAddHorario" />
                        <q-btn color="primary" :label="editingHorarioId !== null ? 'Guardar cambios' : 'Agregar franja'"
                            type="submit" :loading="appointmentStore.loadingHorarios" />
                    </q-card-actions>
                </q-form>
            </q-card>
        </q-dialog>

        <!-- ── Add Patient Dialog ──────────────────────────────────── -->
        <q-dialog v-model="showPatientDialog" @hide="resetPatientForm">
            <q-card style="width: min(380px, 95vw); max-width: 95vw">
                <q-form @submit.prevent="addPatient">
                    <q-card-section class="row items-center q-pb-none">
                        <div class="text-h6">Nuevo Paciente</div>
                        <q-space />
                        <q-btn icon="close" flat round dense v-close-popup />
                    </q-card-section>

                    <q-card-section class="q-gutter-md q-pt-md">

                        <q-input filled v-model="patientForm.nombre" label="Nombre *"
                            :rules="[val => !!val?.trim() || 'Requerido']" />
                        <q-input filled v-model="patientForm.apellido" label="Apellido *"
                            :rules="[val => !!val?.trim() || 'Requerido']" />
                        <q-input filled v-model="patientForm.obraSocial" label="Obra social" />
                        <q-input filled v-model="patientForm.telefono" label="Teléfono" type="tel" />
                    </q-card-section>

                    <q-card-actions align="right" class="q-pa-md">
                        <q-btn flat label="Cancelar" v-close-popup />
                        <q-btn color="primary" label="Guardar paciente" type="submit" />
                    </q-card-actions>
                </q-form>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { date, useQuasar } from 'quasar';
import { useMedicalStore } from 'src/stores/medicalStore';
import { useAppointmentStore, type HorarioMedico } from 'src/stores/appointmentStore';
import type { Turno } from 'src/types';

// ── Types ────────────────────────────────────────────────────────
type TurnoEstado = 'pendiente' | 'confirmado' | 'cancelado' | 'completado';
type PatientOption = { label: string; sublabel?: string; value: { id_paciente: number; nombre: string; apellido: string } };
interface Feriado { fecha: string; tipo: string; nombre: string; }

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// ── Stores ────────────────────────────────────────────────────────
const $q = useQuasar();
const medicalStore = useMedicalStore();
const appointmentStore = useAppointmentStore();

// ── State ─────────────────────────────────────────────────────────
const selectedDate = ref(new Date());
const showAddDialog = ref(false);
const showPatientDialog = ref(false);
const showHorariosDialog = ref(false);
const showEditDialog = ref(false);
const weekView = ref(false);
const calendarExpanded = ref(false);
const turnoSearch = ref('');
const filteredPatientOptions = ref<PatientOption[]>([]);
const feriadosMap = ref<Map<string, string>>(new Map());
const feriadosLoaded = ref<Set<number>>(new Set());

const turnoForm = ref<{ pacienteOpt: PatientOption | null; slot: string; motivo: string }>({
    pacienteOpt: null,
    slot: '',
    motivo: '',
});

const patientForm = ref({ nombre: '', apellido: '', obraSocial: '', telefono: '' });

// Horario form
const horarioForm = ref<Omit<HorarioMedico, 'id' | 'id_medico'>>({
    diaSemana: 1,
    horaInicio: '08:00',
    horaFin: '12:00',
    duracionMinutos: 30,
    maxTurnosPorDia: 0,
});
const editingHorarioId = ref<number | null>(null);
const editingTurnoId = ref<number | null>(null);
const editForm = ref({ slot: '', motivo: '', notas: '' });

// ── Static data ───────────────────────────────────────────────────
const statusOptions: { value: TurnoEstado; label: string; icon: string; color: string }[] = [
    { value: 'pendiente', label: 'Pendiente', icon: 'schedule', color: 'amber-5' },
    { value: 'confirmado', label: 'Confirmado', icon: 'event_available', color: 'teal' },
    { value: 'completado', label: 'Completado', icon: 'check_circle', color: 'green' },
    { value: 'cancelado', label: 'Cancelado', icon: 'cancel', color: 'red' },
];

// ── Lifecycle ─────────────────────────────────────────────────────
const fetchFeriados = async (year: number) => {
    if (feriadosLoaded.value.has(year)) return;
    try {
        const res = await fetch(`https://api.argentinadatos.com/v1/feriados/${year}`);
        const data: Feriado[] = await res.json();
        data.forEach(f => {
            feriadosMap.value.set(f.fecha, f.nombre);
        });
        feriadosLoaded.value.add(year);
    } catch {
        console.warn('No se pudieron cargar los feriados.');
    }
};

onMounted(async () => {
    const year = new Date().getFullYear();
    await Promise.all([
        medicalStore.fetchAllPatients(),
        appointmentStore.fetchTurnos(),
        appointmentStore.fetchHorarios(),
        fetchFeriados(year),
        fetchFeriados(year + 1),
    ]);
});

// ── Computed ──────────────────────────────────────────────────────
const formattedDate = computed(() =>
    date.formatDate(selectedDate.value, 'dddd DD [de] MMMM [de] YYYY', {
        days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    })
);

const formattedDateShort = computed(() =>
    date.formatDate(selectedDate.value, 'ddd D MMM', {
        daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        monthsShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    })
);

// Horarios activos para el día seleccionado
const horariosDelDia = computed(() => {
    const dow = selectedDate.value.getDay();
    return appointmentStore.horarios.filter(h => h.diaSemana === dow);
});

// Slots generados a partir de las franjas del día
const slotsDelDia = computed(() => {
    const dateStr = date.formatDate(selectedDate.value, 'YYYY-MM-DD');
    const slots: string[] = [];
    for (const h of horariosDelDia.value) {
        const [hi, mi] = h.horaInicio.split(':').map(Number);
        const [hf, mf] = h.horaFin.split(':').map(Number);
        let actual = (hi ?? 0) * 60 + (mi ?? 0);
        const fin = (hf ?? 0) * 60 + (mf ?? 0);
        while (actual <= fin) {
            const hh = String(Math.floor(actual / 60)).padStart(2, '0');
            const mm = String(actual % 60).padStart(2, '0');
            slots.push(`${dateStr}T${hh}:${mm}:00`);
            actual += h.duracionMinutos;
        }
    }
    return slots;
});

// Slots ya ocupados (turnos no cancelados del día)
const slotsOcupados = computed(() => new Set(
    appointmentsForSelectedDate.value
        .filter(t => t.estado !== 'cancelado')
        .map(t => {
            const d = new Date(t.fechaHora);
            const pad = (n: number) => String(n).padStart(2, '0');
            return `${date.formatDate(d, 'YYYY-MM-DD')}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
        })
));

const slotOptions = computed(() =>
    slotsDelDia.value.map(s => {
        const d = new Date(s);
        const label = date.formatDate(d, 'HH:mm');
        return { label: slotsOcupados.value.has(s) ? `${label} (ocupado)` : label, value: s, disable: slotsOcupados.value.has(s) };
    })
);

const slotsLibres = computed(() =>
    slotsDelDia.value.filter(s => !slotsOcupados.value.has(s)).length
);

const appointmentsForSelectedDate = computed(() =>
    appointmentStore.turnos
        .filter(t => date.isSameDate(new Date(t.fechaHora), selectedDate.value, 'day'))
        .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
);

// Max turnos del día sumando todas las franjas del día seleccionado
const maxTurnosDia = computed(() =>
    horariosDelDia.value.reduce((sum, h) => sum + h.maxTurnosPorDia, 0)
);

const turnosActivosDia = computed(() =>
    appointmentsForSelectedDate.value.filter(t => t.estado !== 'cancelado').length
);

const sobreturnos = computed(() =>
    maxTurnosDia.value > 0 ? Math.max(0, turnosActivosDia.value - maxTurnosDia.value) : 0
);

const feriadoDelDia = computed(() => {
    const key = date.formatDate(selectedDate.value, 'YYYY-MM-DD');
    return feriadosMap.value.get(key) ?? null;
});

const calendarAttributes = computed(() => [
    { key: 'today', highlight: true, dates: new Date() },
    {
        key: 'turnos',
        dot: 'blue',
        dates: [...new Set(
            appointmentStore.turnos.map(t => date.formatDate(new Date(t.fechaHora), 'YYYY-MM-DD'))
        )].map(d => new Date(d + 'T12:00:00')),
    },
    ...[...feriadosMap.value.entries()].map(([dateStr, motivo]) => ({
        key: `feriado-${dateStr}`,
        dot: { color: 'red', class: 'feriado-dot' },
        popover: { label: `🗓️ ${motivo}`, visibility: 'hover' },
        dates: new Date(dateStr + 'T12:00:00'),
    })),
]);

const stats = computed(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    const semanaAll = appointmentStore.turnos.filter(t => { const d = new Date(t.fechaHora); return d >= startOfWeek && d <= endOfWeek; });
    const cancelados = semanaAll.filter(t => t.estado === 'cancelado').length;
    const tasaCancelacion = semanaAll.length > 0 ? Math.round((cancelados / semanaAll.length) * 100) : 0;
    return {
        hoy: appointmentStore.turnos.filter(t => date.isSameDate(new Date(t.fechaHora), now, 'day')).length,
        semana: semanaAll.length,
        pendientes: appointmentStore.turnos.filter(t => t.estado === 'pendiente').length,
        completados: appointmentStore.turnos.filter(t => t.estado === 'completado').length,
        cancelados,
        tasaCancelacion,
    };
});

// Vista semanal
const weekDays = computed(() => {
    const startOfWeek = new Date(selectedDate.value);
    startOfWeek.setDate(selectedDate.value.getDate() - selectedDate.value.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return {
            date: d,
            iso: date.formatDate(d, 'YYYY-MM-DD'),
            label: ['D', 'L', 'M', 'X', 'J', 'V', 'S'][i] ?? '',
            count: appointmentStore.turnos.filter(t => date.isSameDate(new Date(t.fechaHora), d, 'day')).length,
            isToday: date.isSameDate(d, now, 'day'),
            isSelected: date.isSameDate(d, selectedDate.value, 'day'),
        };
    });
});

// Turno próximo (solo cuando el día seleccionado es hoy)
const proximoTurnoId = computed(() => {
    if (!isToday.value) return null;
    const now = new Date();
    const proximos = appointmentsForSelectedDate.value.filter(t =>
        t.estado !== 'cancelado' && t.estado !== 'completado' && new Date(t.fechaHora) >= now
    );
    return proximos[0]?.id_turno ?? null;
});

// Pendientes del día
const pendientesDia = computed(() =>
    appointmentsForSelectedDate.value.filter(t => t.estado === 'pendiente').length
);

// ¿Es hoy el día seleccionado?
const isToday = computed(() => date.isSameDate(selectedDate.value, new Date(), 'day'));

// Turnos filtrados por búsqueda
const filteredTurnos = computed(() => {
    if (!turnoSearch.value.trim()) return appointmentsForSelectedDate.value;
    const needle = turnoSearch.value.toLowerCase();
    return appointmentsForSelectedDate.value.filter(t =>
        t.paciente.nombre?.toLowerCase().includes(needle) ||
        t.paciente.apellido?.toLowerCase().includes(needle)
    );
});

// Slots para el diálogo de edición (incluye el slot actual aunque esté ocupado)
const slotOptionsEdit = computed(() => {
    if (editingTurnoId.value === null) return slotOptions.value;
    const turno = appointmentStore.turnos.find(t => t.id_turno === editingTurnoId.value);
    if (!turno) return slotOptions.value;
    const d = new Date(turno.fechaHora);
    const pad = (n: number) => String(n).padStart(2, '0');
    const currentSlot = `${date.formatDate(d, 'YYYY-MM-DD')}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
    return slotsDelDia.value.map(s => {
        const isOcupado = slotsOcupados.value.has(s) && s !== currentSlot;
        const label = date.formatDate(new Date(s), 'HH:mm');
        return { label: isOcupado ? `${label} (ocupado)` : label, value: s, disable: isOcupado };
    });
});

// ── Helpers ───────────────────────────────────────────────────────
const formatTime = (iso: string) => date.formatDate(new Date(iso), 'HH:mm');

const getPatient = (id: number) => medicalStore.patients.find(p => p.id_paciente === id);

const initials = (p: Turno['paciente']) =>
    `${(p.nombre ?? '?').charAt(0)}${(p.apellido ?? '?').charAt(0)}`.toUpperCase();

const statusColor = (estado: TurnoEstado): string => ({
    pendiente: 'amber-5',
    confirmado: 'teal',
    cancelado: 'red',
    completado: 'green',
}[estado]);

const isSobreturno = (idx: number) => maxTurnosDia.value > 0 && idx >= maxTurnosDia.value;
const isProximo = (turno: Turno) => turno.id_turno === proximoTurnoId.value;

const tiempoRestante = (turno: Turno): string | null => {
    if (!isProximo(turno)) return null;
    const diff = new Date(turno.fechaHora).getTime() - Date.now();
    if (diff <= 0) return 'ahora';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `en ${mins} min`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem > 0 ? `en ${hrs}h ${rem}min` : `en ${hrs}h`;
};

// ── Navigation ────────────────────────────────────────────────────
const prevDay = () => {
    const d = new Date(selectedDate.value);
    d.setDate(d.getDate() - 1);
    selectedDate.value = d;
};
const nextDay = () => {
    const d = new Date(selectedDate.value);
    d.setDate(d.getDate() + 1);
    selectedDate.value = d;
};
const goToday = () => { selectedDate.value = new Date(); };

// ── Event handlers ────────────────────────────────────────────────
const handleDayClick = (day: { date?: Date }) => {
    if (day.date) selectedDate.value = day.date;
    if ($q.screen.xs) calendarExpanded.value = false;
};

const openAddDialog = () => {
    turnoForm.value = { pacienteOpt: null, slot: '', motivo: '' };
    showAddDialog.value = true;
};

const filterPatients = (val: string, update: (fn: () => void) => void) => {
    update(() => {
        const needle = val.toLowerCase();
        filteredPatientOptions.value = medicalStore.patients
            .filter(p =>
                !needle ||
                p.nombre?.toLowerCase().includes(needle) ||
                p.apellido?.toLowerCase().includes(needle) ||
                p.telefonoCelular?.includes(needle) ||
                p.telefonoFijo?.includes(needle) ||
                p.dni?.includes(needle)
            )
            .map(p => {
                const details = [p.dni, p.telefonoCelular ?? p.telefonoFijo].filter(Boolean).join(' · ');
                return {
                    label: `${p.apellido ?? ''} ${p.nombre ?? ''}`.trim(),
                    ...(details ? { sublabel: details } : {}),
                    value: { id_paciente: p.id_paciente, nombre: p.nombre ?? '', apellido: p.apellido ?? '' },
                };
            });
    });
};

const openPatientFromTurno = (input: string) => {
    const parts = input.trim().split(' ');
    patientForm.value.nombre = parts[0] ?? '';
    patientForm.value.apellido = parts.slice(1).join(' ');
    showAddDialog.value = false;
    showPatientDialog.value = true;
};

const resetPatientForm = () => {
    patientForm.value = { nombre: '', apellido: '', obraSocial: '', telefono: '' };
};

const addPatient = async () => {
    try {
        const os = patientForm.value.obraSocial.trim();
        const tel = patientForm.value.telefono.trim();
        await medicalStore.addPatient({
            nombre: patientForm.value.nombre.trim(),
            apellido: patientForm.value.apellido.trim(),
            ...(os ? { obraSocial: os } : {}),
            ...(tel ? { telefonoCelular: tel } : {}),
        });
        showPatientDialog.value = false;
        $q.notify({ color: 'positive', icon: 'check_circle', message: 'Paciente guardado correctamente.' });
    } catch {
        $q.notify({ color: 'negative', icon: 'report_problem', message: 'Error al guardar el paciente.' });
    }
};

const addTurno = async () => {
    if (!turnoForm.value.pacienteOpt || !turnoForm.value.slot) return;

    const result = await appointmentStore.addTurno({
        fechaHora: turnoForm.value.slot,
        id_paciente: turnoForm.value.pacienteOpt.value.id_paciente,
        ...(turnoForm.value.motivo.trim() ? { motivo: turnoForm.value.motivo.trim() } : {}),
    });

    if (result) {
        showAddDialog.value = false;
        $q.notify({ color: 'positive', icon: 'check_circle', message: 'Turno guardado correctamente.' });
    } else {
        $q.notify({ color: 'negative', icon: 'report_problem', message: appointmentStore.error ?? 'Error al guardar el turno.' });
    }
};

const confirmAll = async () => {
    const pendientes = appointmentsForSelectedDate.value.filter(t => t.estado === 'pendiente');
    await Promise.all(pendientes.map(t => appointmentStore.updateTurnoEstado(t.id_turno, 'confirmado')));
    $q.notify({ color: 'positive', icon: 'done_all', message: `${pendientes.length} turno${pendientes.length !== 1 ? 's' : ''} confirmado${pendientes.length !== 1 ? 's' : ''}.` });
};

const openEditDialog = (turno: Turno) => {
    editingTurnoId.value = turno.id_turno;
    const d = new Date(turno.fechaHora);
    const pad = (n: number) => String(n).padStart(2, '0');
    editForm.value = {
        slot: `${date.formatDate(d, 'YYYY-MM-DD')}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`,
        motivo: turno.motivo ?? '',
        notas: turno.notas ?? '',
    };
    showEditDialog.value = true;
};

const saveEditTurno = async () => {
    if (editingTurnoId.value === null) return;
    const payload: { fechaHora?: string; motivo?: string; notas?: string } = {
        fechaHora: editForm.value.slot,
        ...(editForm.value.motivo.trim() ? { motivo: editForm.value.motivo.trim() } : {}),
        ...(editForm.value.notas.trim() ? { notas: editForm.value.notas.trim() } : {}),
    };
    const ok = await appointmentStore.updateTurno(editingTurnoId.value, payload);
    if (ok) {
        showEditDialog.value = false;
        $q.notify({ color: 'positive', icon: 'check_circle', message: 'Turno actualizado.' });
    } else {
        $q.notify({ color: 'negative', message: appointmentStore.error ?? 'Error al actualizar.' });
    }
};

const exportCSV = () => {
    const rows = [
        ['Horario', 'Nombre', 'Obra social', 'Telefono', 'Motivo', 'Estado'],
        ...appointmentsForSelectedDate.value.map(t => [
            formatTime(t.fechaHora),
            `${t.paciente.apellido ?? ''} ${t.paciente.nombre ?? ''}`.trim(),
            getPatient(t.id_paciente)?.obraSocial ?? '',
            getPatient(t.id_paciente)?.telefonoCelular ?? getPatient(t.id_paciente)?.telefonoFijo ?? '',
            t.motivo ?? '',
            t.estado,
        ]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `turnos-${date.formatDate(selectedDate.value, 'YYYY-MM-DD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};

const changeStatus = (id: number, estado: TurnoEstado) => {
    const doUpdate = async () => {
        const ok = await appointmentStore.updateTurnoEstado(id, estado);
        if (!ok) $q.notify({ color: 'negative', message: appointmentStore.error ?? 'Error al actualizar.' });
    };
    if (estado === 'cancelado') {
        $q.dialog({ title: 'Cancelar turno', message: '¿Confirmás que querés cancelar este turno?', cancel: true, persistent: true })
            .onOk(doUpdate);
    } else {
        void doUpdate();
    }
};

const deleteTurno = (id: number) => {
    $q.dialog({
        title: 'Eliminar turno',
        message: '¿Confirma que desea eliminar este turno?',
        cancel: true,
        persistent: true,
    }).onOk(async () => {
        const ok = await appointmentStore.deleteTurno(id);
        if (ok) $q.notify({ color: 'positive', message: 'Turno eliminado.' });
        else $q.notify({ color: 'negative', message: appointmentStore.error ?? 'Error al eliminar.' });
    });
};

// ── Horarios handlers ─────────────────────────────────────────────
const openAddHorario = () => {
    editingHorarioId.value = null;
    horarioForm.value = { diaSemana: 1, horaInicio: '08:00', horaFin: '12:00', duracionMinutos: 30, maxTurnosPorDia: 8 };
    syncMaxTurnos();
};

const editHorario = (h: HorarioMedico) => {
    editingHorarioId.value = h.id;
    horarioForm.value = {
        diaSemana: h.diaSemana,
        horaInicio: h.horaInicio.slice(0, 5),
        horaFin: h.horaFin.slice(0, 5),
        duracionMinutos: h.duracionMinutos,
        maxTurnosPorDia: h.maxTurnosPorDia,
    };
    syncMaxTurnos();
};

const syncMaxTurnos = () => {
    const [hi = NaN, mi = NaN] = horarioForm.value.horaInicio.split(':').map(Number);
    const [hf = NaN, mf = NaN] = horarioForm.value.horaFin.split(':').map(Number);
    if (isNaN(hi) || isNaN(hf)) return;
    const dur = horarioForm.value.duracionMinutos;
    if (!dur || dur < 1) return;
    const totalMin = (hf * 60 + mf) - (hi * 60 + mi);
    horarioForm.value.maxTurnosPorDia = totalMin > 0 ? Math.floor(totalMin / dur) + 1 : 0;
};

const calculatedMaxTurnos = computed(() => {
    const [hi = NaN, mi = NaN] = horarioForm.value.horaInicio.split(':').map(Number);
    const [hf = NaN, mf = NaN] = horarioForm.value.horaFin.split(':').map(Number);
    if (isNaN(hi) || isNaN(hf)) return 0;
    const dur = horarioForm.value.duracionMinutos;
    if (!dur || dur < 1) return 0;
    const totalMin = (hf * 60 + mf) - (hi * 60 + mi);
    return totalMin > 0 ? Math.floor(totalMin / dur) + 1 : 0;
});

const saveHorario = async () => {
    const payload = {
        ...horarioForm.value,
        horaInicio: horarioForm.value.horaInicio.length === 5 ? `${horarioForm.value.horaInicio}:00` : horarioForm.value.horaInicio,
        horaFin: horarioForm.value.horaFin.length === 5 ? `${horarioForm.value.horaFin}:00` : horarioForm.value.horaFin,
    };
    let ok: unknown;
    if (editingHorarioId.value !== null) {
        ok = await appointmentStore.updateHorario(editingHorarioId.value, payload);
    } else {
        ok = await appointmentStore.addHorario(payload);
    }
    if (ok) {
        editingHorarioId.value = null;
        horarioForm.value = { diaSemana: 1, horaInicio: '08:00', horaFin: '12:00', duracionMinutos: 30, maxTurnosPorDia: 8 };
        $q.notify({ color: 'positive', icon: 'check_circle', message: 'Horario guardado.' });
    } else {
        $q.notify({ color: 'negative', message: appointmentStore.error ?? 'Error al guardar el horario.' });
    }
};

const deleteHorario = (id: number) => {
    $q.dialog({ title: 'Eliminar franja', message: '¿Eliminar esta franja horaria?', cancel: true })
        .onOk(async () => {
            const ok = await appointmentStore.deleteHorario(id);
            if (ok) $q.notify({ color: 'positive', message: 'Franja eliminada.' });
            else $q.notify({ color: 'negative', message: appointmentStore.error ?? 'Error.' });
        });
};

const printTurnos = () => {
    const el = document.getElementById('print-turnos');
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
        <meta charset="utf-8">
        <title>Turnos</title>
        <style>
            body { margin: 24px; font-family: sans-serif; }
            @media print { body { margin: 12px; } }
        </style>
    </head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
    win.close();
};
</script>

<style scoped>
.custom-calendar {
    border: none;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
}

.turno-item {
    transition: background-color 0.15s ease;
}

.turno-item:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

.sobreturno-item {
    background-color: rgba(255, 214, 0, 0.08);
    border-left: 3px dashed #f9a825;
}

.proximo-item {
    background-color: rgba(25, 118, 210, 0.05);
    border-left: 3px solid #1976d2;
}

.patient-item:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

.week-day-cell {
    transition: background-color 0.15s;
}

.week-day-cell:hover {
    filter: brightness(0.95);
}

.week-day-today {
    font-weight: bold;
    outline: 2px solid #1976d2;
    outline-offset: -1px;
}

.stats-scroll {
    overflow-x: auto;
    padding-bottom: 2px;
    -webkit-overflow-scrolling: touch;
}

.stats-scroll::-webkit-scrollbar {
    height: 0;
}

.slide-calendar-enter-active,
.slide-calendar-leave-active {
    transition: max-height 0.3s ease, opacity 0.3s ease;
    overflow: hidden;
    max-height: 500px;
}

.slide-calendar-enter-from,
.slide-calendar-leave-to {
    max-height: 0;
    opacity: 0;
}

@media (max-width: 599px) {
    .turno-item {
        padding-left: 8px !important;
        padding-right: 8px !important;
    }
}

:deep(.vc-day) {
    border-radius: 4px;
}
</style>