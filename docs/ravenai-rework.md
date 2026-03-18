# ravenAI - Rework UI/UX

## Resumen
Rediseno completo de StudyVerse a ravenAI con glassmorphism, dark mode, gamificacion y navegacion responsiva.

## Arquitectura visual

### Glassmorphism
- Clases CSS: `.glass`, `.glass-heavy`, `.glass-hover`
- CSS variables para light/dark en `:root` y `.dark` (src/index.css)
- backdrop-filter blur 12px-20px con bordes semi-transparentes

### Paleta de colores
- Primary: raven-600 (#1e3a5f) - azul profundo
- Secondary: sky-400 (#60a5fa) - azul cielo
- Accent: cyan-400 (#22d3ee) - cyan/teal
- Fondo light: gradiente #eef4fb -> #d5e3f5
- Fondo dark: gradiente #081220 -> #162d4a

### Dark mode
- Tailwind `darkMode: 'class'` + CSS custom properties
- Toggle en navbar aplica clase `.dark` a `<html>`
- Persistencia en localStorage (`ravenai_dark_mode`)

## Componentes nuevos

### Navegacion
- `Navbar.jsx` - Top bar desktop (hidden mobile): logo, nav links, stats, dark toggle
- `BottomTabs.jsx` - Bottom tabs mobile (hidden desktop): Home, Estudio, Tarjetas, Quiz
- `Layout.jsx` - Wrapper con Navbar + contenido + BottomTabs

### Gamificacion
- `XpPopup.jsx` - Animacion "+N XP" flotante
- `RavenLogo.jsx` - SVG inline del cuervo minimalista

## Sistema de gamificacion

### Estado (StudyContext.jsx)
- `xp` - Experiencia acumulada
- `level` - Nivel (cada 100 XP)
- `streak` - Dias consecutivos
- `lastStudyDate` - Ultima fecha de estudio
- `badges` - Array de badge IDs ganados
- `totalCardsKnown` - Total tarjetas marcadas

### Acciones
- `ADD_XP` - Suma XP (+10 quiz correcto, +5 tarjeta conocida)
- `UPDATE_STREAK` - Actualiza racha diaria
- `EARN_BADGE` - Otorga badge
- `TOGGLE_DARK_MODE` - Cambia tema

### Badges disponibles
- first_card, card_master, quiz_ace, streak_3, streak_7, level_5, level_10, all_topics

### Persistencia
- localStorage key: `ravenai_gamification` (xp, level, streak, badges, etc.)
- localStorage key: `ravenai_dark_mode` (boolean)

## Animaciones (tailwind.config.js)
- fadeIn, slideUp, slideDown, scaleIn - transiciones de pagina
- glowPulse - efecto glow ciclico
- bounceIn - entrada con rebote
- xpPop - popup XP que sube y desaparece
- streakFire - icono fuego pulsante

## Botones
- `.btn-glass` - Transparente con blur
- `.btn-primary-glass` - Gradiente azul
- `.btn-accent-glass` - Gradiente cyan
- `.btn-success-glass` - Gradiente verde
- `.btn-danger-glass` - Gradiente rojo
