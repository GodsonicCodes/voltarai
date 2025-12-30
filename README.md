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

## Page Navigation

You can link directly to any section of the site using the following section IDs:

| Section | ID | Example URL |
|---------|----|-------------|
| Hero Section | `#hero` | `https://voltar.ai/#hero` |
| Voice Agent | `#voice-agent` | `https://voltar.ai/#voice-agent` |
| AI Benefits | `#ai-benefits` | `https://voltar.ai/#ai-benefits` |
| In a Nutshell | `#in-a-nutshell` | `https://voltar.ai/#in-a-nutshell` |
| Our Services | `#our-services` | `https://voltar.ai/#our-services` |
| Problem Statement | `#problem-statement` | `https://voltar.ai/#problem-statement` |
| Solution | `#solution` | `https://voltar.ai/#solution` |
| Complete AI Workforce | `#ai-workforce` | `https://voltar.ai/#ai-workforce` |
| Custom AI Agents | `#custom-ai-agents` | `https://voltar.ai/#custom-ai-agents` |
| Results | `#results` | `https://voltar.ai/#results` |
| Contact CTA | `#contact-cta` | `https://voltar.ai/#contact-cta` |
| Get Started | `#get-started` | `https://voltar.ai/#get-started` |
| FAQ | `#faq` | `https://voltar.ai/#faq` |
| About Us | `#about-us` | `https://voltar.ai/#about-us` |
| Final CTA | `#final-cta` | `https://voltar.ai/#final-cta` |

### Usage Examples

1. **Linking to a specific section from another page:**
   ```html
   <a href="/#faq">View our FAQ</a>
   ```

2. **Linking from an external site:**
   ```
   https://voltar.ai/#voice-agent
   ```

3. **Linking to a specific section from within the same page:**
   ```html
   <a href="#contact-cta" className="smooth-scroll">Contact Us</a>
   ```

### Smooth Scrolling (Optional)

For a smoother scrolling experience when navigating between sections, add this CSS to your global styles:

```css
html {
  scroll-behavior: smooth;
}
```

## License

See