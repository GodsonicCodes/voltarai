# VoltarAi

This is the frontend for VoltarAi.

## Installed Packages

- **Next.js** (React framework)
- **Tailwind CSS** (utility-first CSS framework)
- **shadcn/ui** (component registry)
- **ESLint** (linting)
- **TypeScript** (static typing)
- **motion** (animation library)

See [`package.json`](package.json) for the full list of dependencies.

## Setup Instructions

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Run the development server:**
   ```sh
   npm run dev
   ```

3. **Build for production:**
   ```sh
   npm run build
   ```

4. **Start the production server:**
   ```sh
   npm start
   ```

## Custom Classes & CSS Variables

Global styles are defined in [`src/app/globals.css`](src/app/globals.css).

### Tailwind Customization

- **Base Color:** `neutral`
- **CSS Variables:** Enabled
- **Prefix:** None

### Example Custom Classes & Variables

```css
/* src/app/globals.css */
.textradialgradientgrey
.textradialgradientblue

**Aliases:**
- `@/components`
- `@/lib`
- `@/hooks`
- `@/components/ui`
- `@/lib/utils`

See [`components.json`](components.json) for configuration details.

---

## License

See