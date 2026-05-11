# 📚 Quick Reference - Nuevas Características Innerlog

## 🎯 Para El Usuario (Atleta)

### Donde Encontrar Todo

| Característica | Ubicación | Cómo Acceder |
|---|---|---|
| **Intervención Sugerida** | Dashboard (Inicio) | Aparece automáticamente según readiness |
| **Mis Patrones** | Dashboard → Botón "Mis Patrones" | Análisis de 30 días |
| **Reporte Semanal** | Perfil → "Mi Semana" | Resumen de la semana |
| **Historial de Intervenciones** | Página Historial | Ver todas las completadas |

### Intervenciones - Los 3 Tipos

```
🧘 RESPIRACIÓN (2 min)
├── Cuando: Readiness < 50
├── Qué: Box breathing 4-4-4-4
└── Pasos: 5 simples, guiados

⚡ ACTIVACIÓN (5 min)
├── Cuando: Readiness > 75
├── Qué: Rutina pre-entrenamiento
└── Pasos: Movilidad → Burpees → Respira → Saltos

💆 RECUPERACIÓN (5 min)
├── Cuando: Readiness 50-75
├── Qué: Protocolo post-entrenamiento
└── Pasos: Camina → Estira → Respira → Medita
```

### Patrones - Las 4 Categorías

```
🔴 PATRÓN DE FATIGA
   "¿En qué días bajo mi readiness?"
   → Ver día + score + gráfico + recomendación

🛌 CORRELACIÓN SUEÑO-COGNITIVO
   "¿Afecta mi sueño al rendimiento?"
   → Ver comparativa bajos vs altos sueño

😊 PATRÓN EMOCIONAL
   "¿Cuándo estoy más emocional?"
   → Ver día crítico + score + gráfico

🏆 MEJOR MOMENTO
   "¿Cuál es mi mejor día?"
   → Ver día peak + score + sugerencia
```

### Reporte Semanal - Métricas

```
📈 Readiness Promedio: promedio, mín, máx
🏆 Mejor/Peor Día: día + score
🧠 Test Cognitivo: tipo + cantidad + precisión
🔍 Patrón Destacado: insight + contexto
✅ Intervenciones: cantidad completadas
📊 vs Semana Anterior: tendencia (arriba/abajo/estable)
```

---

## 🏋️ Para El Entrenador

### Dashboard Ampliado

**3 Tabs Principales:**

```
1️⃣ ATLETAS (original)
   └── Lista de atletas con readiness actual

2️⃣ PATRONES DEL EQUIPO
   ├── 📉 Día más difícil
   ├── 📊 Atleta más inestable
   └── 🚀 Atleta mejorando

3️⃣ INTERVENCIONES
   └── Atletas que completaron esta semana
       ├── Cantidad de intervenciones
       ├── Tipos realizados
       └── Fecha última completada
```

### Interpretación de Patrones

| Patrón | Significa | Acción Recomendada |
|---|---|---|
| Peor día (ej: Lunes) | Todo el equipo baja | Entrenamientos más ligeros ese día |
| Atleta con variabilidad | Inestabilidad de rendimiento | Seguimiento más cercano |
| Tendencia positiva | Mejora en últimas 2 semanas | Reconocer el trabajo |

---

## 🔄 Flujos Típicos de Uso

### Flujo 1: Atleta con Readiness Bajo
```
1. Login → Dashboard
2. Ve intervención sugerida (Respiración)
3. Click "Comenzar" → Timer inicia (2 min)
4. Sigue 5 pasos → Click "Completé"
5. ¡Hecho! Intervención registrada
```

### Flujo 2: Atleta Explorando Patrones
```
1. Dashboard → "Mis Patrones"
2. Lee los 4 patrones de 30 días
3. Identifica su peor día (ej: Lunes)
4. Lee la recomendación
5. Actúa en consecuencia (ajusta entrenamientos)
```

### Flujo 3: Entrenador Monitoreando
```
1. Dashboard (/entrenador)
2. Tab "Patrones" → Ve situación del equipo
3. Tab "Intervenciones" → Ve quién fue activo
4. Toma decisiones de entrenamiento
5. Reconoce atletas activos
```

---

## 📊 Ejemplos de Insights

### Atleta - Patrón de Fatiga
```
"Tus lunes tienen un readiness promedio de 52 
— el más bajo de tu semana"

Recomendación: Considera una intervención de 
recuperación los lunes
```

### Atleta - Sueño-Cognitivo
```
"Cuando duermes menos (< 3/5), tu rendimiento 
cognitivo es 65%. Con más sueño es 82% 
(diferencia: 17%)"

Recomendación: Prioriza las noches con sueño 
>= 3/5 antes de entrenamientos exigentes
```

### Entrenador - Peor Día del Equipo
```
"Miércoles es el día más difícil para el equipo 
con readiness promedio de 58"

Recomendación: Considera entrenamientos más 
ligeros ese día
```

---

## ⚙️ Configuración Técnica

### Datos Analizados
- **Período**: Últimos 30 días (configurable en backend)
- **Actualización**: Real-time (bajo demanda)
- **Puntos de Datos**: Readiness + Wellness + Tests + Sesiones

### Triggers Automáticos
- Intervención Sugerida: Diariamente según readiness
- Patrones: Bajo demanda (GET /api/patrones)
- Reporte: Bajo demanda, cálculo para semana actual

---

## 🚀 Tips de Máximo Uso

1. **Registra datos consistentemente**: Los patrones mejoran con más datos
2. **Revisa tus patrones semanalmente**: Identifica tendencias
3. **Actúa sobre recomendaciones**: No solo lea, implemente
4. **Completa intervenciones**: Registran el tiempo invertido
5. **Comparte reportes**: Usa el botón compartir para feedback

---

## ❓ FAQ Rápido

**P: ¿Cuántos datos necesito para ver patrones?**
R: Mínimo 7 días, óptimo 30+

**P: ¿Las intervenciones se asignan automáticamente?**
R: Sí, basadas en readiness del día

**P: ¿Puedo ver datos de otros?**
R: Atleta ve solo los suyos. Entrenador ve su equipo.

**P: ¿Cada cuándo se actualiza el reporte?**
R: Se calcula semanalmente (lunes a domingo)

**P: ¿Puedo descargar el reporte?**
R: Compartir genera texto para redes sociales

---

## 📞 Soporte

Si algo no funciona:
1. Verificar BD tiene tabla `intervenciones`
2. Verificar usuario tiene readiness calculado
3. Verificar token de autenticación es válido
4. Revisar console para errores
5. Contactar admin

---

**Versión**: 1.0
**Última actualización**: 2026-05-06
**Estado**: ✅ PRODUCCIÓN
