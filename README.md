# 🏥 Historias Clínicas - Frontend

Sistema de gestión de historias clínicas para médicos, desarrollado con Vue 3 + Quasar Framework. Permite la administración completa de pacientes, consultas médicas y seguimiento de historiales clínicos.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos del Sistema](#requisitos-del-sistema)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API y Backend](#api-y-backend)
- [PWA (Aplicación Web Progresiva)](#pwa-aplicación-web-progresiva)
- [Scripts Disponibles](#scripts-disponibles)
- [Contribución](#contribución)
- [Autor](#autor)

## ✨ Características

### 🔐 Autenticación y Autorización
- Sistema de registro para médicos con validación completa
- Inicio de sesión seguro con JWT
- Persistencia de sesión en localStorage
- Protección de rutas privadas

### 👨‍⚕️ Gestión de Médicos
- Registro completo de datos profesionales
- Información de especialidad y matrícula
- Datos del consultorio
- Biografía profesional
- Horarios de atención

### 👥 Gestión de Pacientes
- Registro completo de pacientes
- Información personal y de contacto
- Datos médicos y antecedentes
- Examen físico detallado
- Gestión de imágenes médicas
- Historial médico completo

### 📅 Sistema de Citas
- Calendario interactivo
- Programación de consultas
- Vista de citas por día/semana/mes
- Notificaciones y recordatorios

### 🏥 Consultas Médicas
- Registro de consultas detalladas
- Diagnósticos y tratamientos
- Seguimiento de evolución
- Prescripciones médicas
- Laboratorios e imágenes

### 📊 Dashboard y Estadísticas
- Resumen de pacientes registrados
- Total de consultas realizadas
- Métricas de productividad
- Gráficos y visualizaciones

### 📱 Aplicación Web Progresiva (PWA)
- Instalable en dispositivos móviles
- Funcionamiento offline
- Notificaciones push
- Sincronización automática

## 🛠 Tecnologías

### Frontend
- **Vue 3** - Framework JavaScript progresivo
- **Quasar Framework** - Framework UI basado en Vue
- **TypeScript** - Superset tipado de JavaScript
- **Pinia** - Store de estado para Vue
- **Vue Router** - Enrutamiento oficial de Vue
- **Axios** - Cliente HTTP para APIs

### UI/UX
- **Quasar Components** - Componentes Material Design
- **Material Icons** - Iconografía
- **SCSS** - Preprocesador CSS
- **Responsive Design** - Adaptable a todos los dispositivos

### Herramientas de Desarrollo
- **Vite** - Bundler y servidor de desarrollo
- **ESLint** - Linter para JavaScript/TypeScript
- **Vue I18n** - Internacionalización
- **V-Calendar** - Componente de calendario

### PWA
- **Workbox** - Service Workers para PWA
- **Web App Manifest** - Configuración de aplicación web

## 📋 Requisitos del Sistema

- **Node.js**: ^18, ^20, ^22, ^24, ^26, ^28
- **npm**: >= 6.13.4 o **yarn**: >= 1.21.1
- **Navegador moderno** con soporte para ES6+

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/EnzoSives/front-historias-clinicas.git
cd front-historias-clinicas
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 3. Instalar Quasar CLI (si no está instalado)
```bash
npm install -g @quasar/cli
# o
yarn global add @quasar/cli
```

## ⚙️ Configuración

### Variables de Entorno

El proyecto utiliza una configuración de API centralizada en `src/boot/axios.ts`:

```typescript
const api = axios.create({ 
  baseURL: 'https://api.hcmadariaga.online/' 
});
```

Para entornos de desarrollo local, puedes modificar la baseURL:

```typescript
const api = axios.create({ 
  baseURL: 'http://localhost:3007' 
});
```

### Configuración del Backend

Asegúrate de que el backend esté ejecutándose y sea accesible en la URL configurada. El frontend espera los siguientes endpoints:

- `POST /auth/login` - Autenticación
- `POST /auth/register` - Registro de médicos
- `GET /patients` - Obtener pacientes
- `POST /patients` - Crear paciente
- `GET /consultations` - Obtener consultas
- `POST /consultations` - Crear consulta

## 🎯 Uso

### Desarrollo
```bash
npm run dev
# o
quasar dev
```

La aplicación estará disponible en `http://localhost:9000`

### Desarrollo PWA
```bash
npm run dev:pwa
# o
quasar dev -m pwa
```

### Compilación para Producción
```bash
npm run build
# o
quasar build
```

### Compilación PWA para Producción
```bash
npm run build:pwa
# o
quasar build -m pwa
```

### Servir Compilación
```bash
npm run start
# o
quasar serve dist/spa
```

## 📁 Estructura del Proyecto

```
front-historias-clinicas/
├── public/
│   └── icons/              # Iconos para PWA
├── src/
│   ├── assets/             # Recursos estáticos
│   ├── boot/               # Archivos de inicialización
│   │   ├── axios.ts        # Configuración de API
│   │   ├── i18n.ts         # Internacionalización
│   │   └── v-calendar.ts   # Configuración de calendario
│   ├── components/         # Componentes Vue reutilizables
│   │   ├── CalendarView.vue
│   │   ├── ConsultationCard.vue
│   │   ├── ConsultationDetail.vue
│   │   ├── ConsultationForm.vue
│   │   ├── Dashboard.vue
│   │   ├── LoginForm.vue
│   │   ├── PatientCard.vue
│   │   ├── PatientForm.vue
│   │   ├── PatientHistory.vue
│   │   ├── RegisterForm.vue
│   │   └── models.ts
│   ├── css/                # Estilos globales
│   │   ├── app.scss
│   │   └── quasar.variables.scss
│   ├── i18n/               # Archivos de traducción
│   ├── layouts/            # Layouts de página
│   │   └── MainLayout.vue
│   ├── pages/              # Páginas de la aplicación
│   │   ├── IndexPage.vue
│   │   ├── ProfilePage.vue
│   │   └── ErrorNotFound.vue
│   ├── router/             # Configuración de rutas
│   │   ├── index.ts
│   │   └── routes.ts
│   ├── stores/             # Gestión de estado con Pinia
│   │   ├── appointmentStore.ts
│   │   ├── authStore.ts
│   │   ├── medicalStore.ts
│   │   ├── patientStore.ts
│   │   └── index.ts
│   ├── types/              # Definiciones de TypeScript
│   │   └── index.ts
│   ├── App.vue             # Componente raíz
│   └── env.d.ts            # Declaraciones de tipos
├── src-pwa/                # Configuración PWA
│   ├── custom-service-worker.ts
│   ├── manifest.json
│   ├── pwa-env.d.ts
│   ├── register-service-worker.ts
│   └── tsconfig.json
├── package.json
├── quasar.config.ts        # Configuración de Quasar
├── tsconfig.json
└── README.md
```

## 🔌 API y Backend

### Autenticación

La aplicación utiliza autenticación JWT. El token se almacena en localStorage y se incluye automáticamente en todas las peticiones HTTP mediante interceptores de Axios.

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/register` | Registrar médico |
| GET | `/patients` | Obtener lista de pacientes |
| POST | `/patients` | Crear nuevo paciente |
| PUT | `/patients/:id` | Actualizar paciente |
| DELETE | `/patients/:id` | Eliminar paciente |
| GET | `/consultations` | Obtener consultas |
| POST | `/consultations` | Crear nueva consulta |
| GET | `/doctors/profile` | Obtener perfil del médico |

### Manejo de Errores

La aplicación incluye interceptores para manejar errores de autenticación (401) y redirigir automáticamente al login cuando sea necesario.

## 📱 PWA (Aplicación Web Progresiva)

### Características PWA

- **Instalable**: Se puede instalar como aplicación nativa
- **Offline**: Funciona sin conexión a internet
- **Responsive**: Adaptable a cualquier dispositivo
- **Notificaciones**: Push notifications
- **Actualizaciones**: Actualización automática en segundo plano

### Configuración PWA

El archivo `src-pwa/manifest.json` contiene la configuración de la PWA:

```json
{
  "name": "Historias Clínicas",
  "short_name": "HistoriasClinicas",
  "description": "Sistema de gestión de historias clínicas",
  "display": "standalone",
  "start_url": "/",
  "theme_color": "#1976d2",
  "background_color": "#ffffff"
}
```

## 📝 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `quasar dev` | Servidor de desarrollo |
| `dev:pwa` | `quasar dev -m pwa` | Desarrollo PWA |
| `build` | `quasar build` | Compilación para producción |
| `build:pwa` | `quasar build -m pwa` | Compilación PWA |
| `start` | `quasar serve dist/spa` | Servir aplicación compilada |
| `start:pwa` | `quasar serve dist/pwa` | Servir PWA compilada |
| `lint` | `eslint` | Linter de código |
| `test` | `echo "No test specified"` | Pruebas (pendiente) |

## 🏗 Flujo de Trabajo de Desarrollo

### 1. Registro de Médico
1. El médico completa el formulario de registro
2. Se validan los datos en el frontend
3. Se envían al backend para validación y creación
4. Redirección automática al login

### 2. Inicio de Sesión
1. El médico ingresa credenciales
2. Se valida con el backend
3. Se recibe JWT y datos del usuario
4. Se almacena en localStorage y Pinia store
5. Redirección al dashboard

### 3. Gestión de Pacientes
1. Crear/editar pacientes desde el formulario
2. Validación de datos médicos
3. Almacenamiento de imágenes médicas
4. Visualización en tarjetas de paciente

### 4. Consultas Médicas
1. Selección de paciente
2. Programación en calendario
3. Registro de consulta detallada
4. Seguimiento en historial

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- Utilizar TypeScript para tipado estricto
- Seguir las convenciones de Vue 3 Composition API
- Implementar componentes reutilizables
- Documentar funciones complejas
- Mantener consistencia en el naming

## 📄 Licencia

Este proyecto es privado y está desarrollado para uso específico en el ámbito médico.

## 👨‍💻 Autor

**Enzo Sives**
- Email: enzosives7@gmail.com.ar
- GitHub: [@EnzoSives](https://github.com/EnzoSives)

## 🔗 Enlaces Útiles

- [Documentación de Vue 3](https://vuejs.org/)
- [Documentación de Quasar](https://quasar.dev/)
- [Documentación de TypeScript](https://www.typescriptlang.org/)
- [Documentación de Pinia](https://pinia.vuejs.org/)

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto, contactar al autor a través del email proporcionado.

---

⚡ **Desarrollado con Vue 3 + Quasar Framework** ⚡
