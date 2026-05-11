# Panel del Psicólogo Deportivo

## Descripción General

El panel del psicólogo deportivo es una interfaz specializada que permite monitorear el estado de los atletas bajo su seguimiento, ver sus intervenciones prescritas y hacer un seguimiento del progreso.

## Características Principales

### 1. **Pestaña Atletas** 👥
Muestra la lista de todos los atletas en seguimiento con:
- Nombre y datos básicos (deporte, nivel)
- Readiness score (puntuación de condición física)
- Equipo al que pertenecen
- Número de intervenciones asignadas y completadas

**Estadísticas de resumen:**
- Total de atletas bajo seguimiento
- Intervenciones pendientes
- Puntuación promedio de readiness

### 2. **Pestaña Intervenciones** ✅
Listado de todas las intervenciones prescriptas con:
- Título y descripción de cada intervención
- Atleta al que fue asignada y su equipo
- Estado (Completada / Pendiente)
- Tipo de intervención (respiración, activación, recuperación, etc.)
- Duración recomendada
- Fecha de asignación

### 3. **Pestaña Resumen** 📋
Detalle completo de un atleta seleccionado, incluyendo:

#### Datos del Atleta
- Información básica (nombre, deporte, nivel)
- Readiness actual con desglose por componentes:
  - Score General
  - Wellness Score
  - Cognitivo Score
  - Sesión Score

#### Wellness (últimas 7 entradas)
Monitoreo de:
- Fatiga
- Calidad del Sueño
- Dolor
- Estrés

#### Sesiones de Entrenamiento (últimas 3)
Detalles de:
- Esfuerzo Mental
- Satisfacción
- Fatiga de Carrera
- Notas del atleta

#### Tests Cognitivos
- Tipo de test realizado
- Precisión alcanzada
- Tiempo de reacción promedio
- Duración del test

#### Intervenciones Asignadas
Historial de intervenciones con estado de completitud

#### Asignar Nueva Intervención
Formulario para prescribir nuevas intervenciones incluyendo:
- Tipo (Respiración, Activación, Recuperación, Meditación, Otro)
- Título descriptivo
- Descripción/instrucciones
- Duración en minutos

## Flujo de Trabajo

1. **Visualizar Atletas**: Acceder a la pestaña "Atletas" para ver todos los deportistas en seguimiento
2. **Seleccionar Atleta**: Hacer clic en un atleta para ver su resumen detallado
3. **Analizar Estado**: Revisar wellness, sesiones, tests y readiness
4. **Asignar Intervención**: Usar el botón "Asignar Intervención" para prescribir nuevas técnicas
5. **Monitorear Progreso**: Ver intervenciones completadas y estado general

## Datos Visible para Cada Atleta

### Readiness Scores
- **Verde (>70)**: Atleta listo para entrenar
- **Amarillo (40-70)**: Estado regular, tener cuidado
- **Rojo (<40)**: Condición baja, requiere intervención

### Intervenciones Disponibles
- **Respiración**: Técnicas de control respiratorio
- **Activación**: Ejercicios para aumentar energía
- **Recuperación**: Técnicas de recuperación física
- **Meditación**: Prácticas de mindfulness
- **Otro**: Intervenciones personalizadas

## Navegación

El panel del psicólogo deportivo está integrado en el BottomNav:
- **Ruta principal**: `/psicologo`
- **Accesible desde el menú**: "Mis Atletas"
- **Solo para usuarios con rol**: `psicologo_deportivo`

## Actualización de Datos

Los datos se cargan automáticamente al entrar al panel. Para actualizar:
- El panel recarga automáticamente cuando se asigna una intervención
- Se pueden ver cambios en tiempo real del estado del atleta

## Integración con Sistema

El panel está completamente integrado con:
- Sistema de autenticación
- Base de datos de readiness scores
- Histórico de sesiones y wellness
- Sistema de intervenciones
- Gestión de equipos

