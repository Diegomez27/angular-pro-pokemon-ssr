# MAYO FEST - ESPECIFICACIONES TÉCNICAS Y DE DISEÑO (SOURCE OF TRUTH)

Este documento contiene la "Verdad Única" para el proyecto Mayo Fest. Úsalo como referencia absoluta para generar código, estilos y estructuras.

## 1. STACK TECNOLÓGICO (STRICT CONSTRAINTS)

- **Framework:** Angular 18+ (Standalone Components, Signals para estado, Zoneless-ready)
- **Estilos:** Tailwind CSS (Utility-first)
- **Infraestructura:** Vercel (SPA routing configurado)
- **Persistencia:** LocalStorage (sincronizado vía Effects)
- **PWA:** @angular/service-worker (Configuración: AssetGroup prefetch, DataGroup freshness)

## 2. SISTEMA DE DISEÑO Y COLORES (TAILWIND CONFIG)

Usa estos nombres de variables semánticas en el tailwind.config.js.

### Tema: 3 de Mayo  (su cumpleaños)(Festivo/Energético)
- `fest-red`: #C40C0C (Acción principal)
- `sun-yellow`: #F6CE71 (Fondos destacados)
- `cactus-green`: #254F22 (Textos y bordes)

### Tema: Día de la Madre (Reflexivo/Cálido)
- `mom-blush`: #FFDAB3 (Fondos suaves)
- `lilac`: #E6E6FA (Tarjetas)
- `sage`: #7D8966 (Acentos naturales)

### Tema: Día del Maestro (Conductual/Estable)
- `teach-coffee`: #3C4753 (Textos principales)
- `latte`: #D7B588 (Fondos de tarjetas)
- `chalkboard`: #254F22 (Botones)

## 3. ARQUITECTURA DE CARPETAS (FEATURE-FIRST)

No agrupes por tipo. Agrupa por dominio.

```
src/app/
├── core/                          # Singletons (Auth, Config, Global State)
│   ├── services/
│   │   ├── fest-state.service.ts
│   │   └── time-guard.service.ts
│   └── config/
│       └── app.config.ts
├── features/                      # Módulos de Negocio
│   ├── timeline/                  # Vista vertical del calendario
│   ├── reveal/                    # Modal de apertura de regalos
│   └── onboarding/                # Intro para nuevos usuarios
├── shared/                        # UI Reutilizable (Dumb Components)
│   ├── ui/
│   │   ├── confetti/              # Servicio de confeti
│   │   └── button/
│   └── data/
│       └── fest-data.json         # Esquema de datos estático
```

## 4. MODELO DE DATOS (TYPESCRIPT INTERFACES)

El archivo JSON debe cumplir estrictamente con esta firma:

```typescript
export interface FestItem {
  id: string;                       // "day-3", "day-10"
  date: string;                     // Formato ISO "YYYY-MM-DD" (CRÍTICO: Sin hora)
  type: 'gift' | 'message' | 'video';
  theme: 'cinco' | 'mom' | 'teacher';
  content: {
    title: string;
    body: string;
    mediaUrl?: string;              // Opcional
  };
  whatsapp?: {                      // Para compartir/canjear
    phoneNumber: string;            // Destination number
    messageTemplate: string;        // Mensaje pre-llenado
  };
  isLocked?: boolean;               // Estado computado en runtime
}
```

## 5. REGLAS DE NEGOCIO CRÍTICAS

### A. Algoritmo de Bloqueo de Tiempo (Time-Lock)

Nunca compares `new Date()` directamente.

1. Obtener fecha actual del dispositivo
2. Resetear horas/minutos/segundos a 0 (`setHours(0,0,0,0)`)
3. Comparar contra la fecha del ítem (parsed):
   - `if (today >= itemDate) -> UNLOCKED`
   - `if (today < itemDate) -> LOCKED`

### B. Generador de Links WhatsApp

Formato obligatorio: `https://wa.me/<number>?text=<encoded_text>`

- El número debe ser sanitizado (remover `+`, `-`, espacios)
- El texto debe usar `encodeURIComponent()`
- Los saltos de línea deben ser explícitos: `%0A`

### C. Estrategia PWA Offline

- **App Shell (HTML/JS/CSS):** Estrategia `prefetch` (Descargar todo al inicio)
- **Media (Imágenes/Videos):** Estrategia `lazy` con TTL de 7 días
