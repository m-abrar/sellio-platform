# Storefront - Dynamic Theme Architecture

This application is built with a **Dynamic Injection Strategy**, allowing it to host multiple entirely different industry themes within a single Next.js codebase while maintaining strict isolation.

## 📁 Directory Structure

```text
/src
  ├── /app                # The Bridge (Neutral Layout/Page)
  ├── /lib
  │   └── theme.ts        # Theme Configuration & Logic
  └── /themes             # Isolated Theme Implementations
      ├── /fashion        # High-contrast, Minimalist Luxury
      ├── /electronics    # Dark Mode, Neon, Glassmorphism
      └── /grocery        # Fresh, Organic, High Whitespace
```

## 🏗️ How It Works

### 1. Theme Isolation
Each folder in `src/themes` is a self-contained unit containing its own:
- `Layout.tsx`: The UI shell (Header, Footer).
- `Page.tsx`: The industry-specific design.
- `styles.css`: Vanilla CSS scoped to the theme's root class (e.g., `.fashion-theme`).

### 2. The Bridge
The root `src/app/layout.tsx` and `src/app/page.tsx` act as **Neutral Bridges**. They:
1. Import the `activeTheme` from `src/lib/theme.ts`.
2. Dynamically import and render the corresponding theme's Layout and Page.

### 3. Style Protection
To prevent CSS leakage between themes, each theme's CSS is wrapped in a unique class:
- **Fashion:** `.fashion-theme`
- **Electronics:** `.electronics-theme`
- **Grocery:** `.grocery-theme`

## 🎨 Current Themes

- **Fashion:** Premium serif typography, minimalist white space, high-contrast black/white.
- **Electronics:** Futuristic "Orbitron" fonts, neon cyan accents, glassmorphic cards.
- **Grocery:** Soft organic greens, high-end "Outfit" typography, vibrant fresh imagery.

## 🚀 Switching Themes
The active theme is controlled via `process.env.NEXT_PUBLIC_THEME` or the `activeTheme` constant in `src/lib/theme.ts`.
