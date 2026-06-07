# Aurora Background — referencia React (NO es el sitio en vivo)

Tu sitio actual (`/OS/web/`) es **HTML + CSS + JS plano** — sin Node, sin build, listo para
subir a cualquier hosting estático. Por eso el efecto Aurora ya está implementado de forma
**nativa en CSS** dentro de `styles.css` (clase `.hero__aurora`), adaptado a tu paleta de
marca (Pinar + Latón sobre Tinta) en lugar del azul/violeta genérico del componente original.

Esta carpeta guarda el **componente React original** que pasaste, por si en el futuro migras
el sitio a un stack React/Next + Tailwind + shadcn. No se usa en producción hoy.

## Si algún día migras a React/shadcn

Requisitos del proyecto: React + TypeScript + Tailwind CSS + estructura shadcn.

1. **Crear proyecto y Tailwind** (si no existe):
   ```bash
   npm create vite@latest mi-app -- --template react-ts
   cd mi-app
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
2. **Inicializar shadcn** (crea `components/ui` y `lib/utils.ts` con `cn`):
   ```bash
   npx shadcn@latest init
   ```
   > Importante: la carpeta `components/ui` es la convención de shadcn. Mantener los
   > componentes ahí permite que el CLI los actualice, evita imports rotos y mantiene
   > el alias `@/components/ui/...` que usa este componente.
3. **Dependencias externas del componente:**
   ```bash
   npm install framer-motion
   ```
   (`cn` viene de `lib/utils.ts` que crea shadcn; usa `clsx` + `tailwind-merge`.)
4. **Copiar** `components/ui/aurora-background.tsx` y `components/ui/demo.tsx` a tu proyecto.
5. **Extender** tu `tailwind.config.ts` con el contenido de `tailwind.config.ts` de esta
   carpeta (animación `aurora` + plugin `addVariablesForColors`, que expone cada color de
   Tailwind como variable CSS `--blue-500`, etc., necesarias para los gradientes).
6. Para que combine con tu marca, cambia en el componente los colores del `--aurora`
   (`--blue-500`, `--indigo-300`, …) por verdes/latón equivalentes
   (`--emerald-700`, `--emerald-500`, `--amber-300` …).

## Assets / iconos
- El componente no requiere imágenes. Si añades logos o íconos, usa `lucide-react`.
- No necesita imágenes de stock (Unsplash) para funcionar.
