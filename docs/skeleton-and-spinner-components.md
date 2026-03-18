# SkeletonCard & LoadingSpinner Components

## SkeletonCard (`src/components/SkeletonCard.jsx`)

Skeleton loading placeholder that uses the glassmorphism `glass` class and Tailwind's `animate-pulse`.

### Props

| Prop       | Type    | Default | Description                          |
|------------|---------|---------|--------------------------------------|
| `lines`    | number  | 3       | Number of pulsing text-line bars     |
| `showIcon` | boolean | false   | Show a 40px circle placeholder       |
| `className`| string  | ''      | Extra classes on the outer container |

### Usage

```jsx
import SkeletonCard from '@/components/SkeletonCard'

<SkeletonCard />                        // 3 lines, no icon
<SkeletonCard lines={5} showIcon />     // 5 lines + icon circle
```

Bar widths cycle through 100%, 80%, 60% based on index.

---

## LoadingSpinner (`src/components/LoadingSpinner.jsx`)

Centered spinning indicator with optional message text.

### Props

| Prop       | Type    | Default | Description                              |
|------------|---------|---------|------------------------------------------|
| `message`  | string  | —       | Optional text below the spinner          |
| `fullPage` | boolean | true    | Wraps in a `min-h-[60vh]` centered flex  |

### Usage

```jsx
import LoadingSpinner from '@/components/LoadingSpinner'

<LoadingSpinner message="Cargando datos..." />
<LoadingSpinner fullPage={false} />            // inline spinner
```

Spinner is a 48px circle with `border-cyan-400` and `animate-spin`. Container uses `animate-fade-in` and the `glass` class. Message text uses `--text-muted` CSS variable.
