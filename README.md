<div align="center">

  <h1>COSS Inertia React Starter Kit</h1>

  <p>
    <strong>An unofficial AdonisJS starter kit with ShadCN, COSS/Base UI, Inertia, and React — preconfigured and ready to go.</strong>
  </p>

  <p>
    ShadCN configured for Inertia apps, with Inertia forms seamlessly integrated into Base UI form primitives.
  </p>

  <br>

<a href="#-whats-in-the-box">Features</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#-quick-start">Quick Start</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#-form-integration">Form Integration</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://adonisjs.com">Documentation</a>

  <br>
  <br>

</div>

---

## ✨ What's in the Box

This starter kit solves two common pain points when building AdonisJS apps with Inertia and React:

1. **Setting up ShadCN for Inertia apps** — ShadCN expects a Next.js or Vite SPA project structure. This kit preconfigures `components.json`, path aliases, and Tailwind so you can run `npx shadcn@latest add` and have components land in the right place.

2. **Integrating Inertia forms with Base UI** — The kit provides a `<Form>` component that bridges Inertia's form handling (route-based submissions, processing state, server errors) with Base UI's `<Form>` primitive, so validation errors flow automatically to `<FieldError>` components without manual wiring.

### 🎯 Core Features

- **🧩 50+ COSS Components** — ShadCN components rebuilt on [Base UI](https://base-ui.com) primitives, ready to use via the [COSS registry](https://coss.com)
- **⚛️ React 19** — Latest React with modern hooks and concurrent features
- **🔄 Inertia.js** — Build SPAs without the API complexity — server-side routing that feels like client-side
- **🔐 Authentication System** — Complete user signup, login, and session management out of the box
- **✅ Form Validation** — Powered by VineJS with automatic error handling via Base UI
- **🔔 Toast Notifications** — Built-in toast system using Sonner
- **🛡️ Security First** — CSRF protection, Shield middleware, and secure session handling
- **🔒 Type Safety** — End-to-end TypeScript with Tuyau for type-safe routing

### 🔧 Tech Stack

<table>
  <tr>
    <td><strong>Backend</strong></td>
    <td>
      <a href="https://adonisjs.com">AdonisJS 7.x</a> — Full-featured Node.js framework
    </td>
  </tr>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>
      <a href="https://react.dev">React 19</a> — Modern UI library with hooks and concurrent rendering
    </td>
  </tr>
  <tr>
    <td><strong>Adapter</strong></td>
    <td>
      <a href="https://inertiajs.com">Inertia.js</a> — Build SPAs with server-side routing (no API needed)
    </td>
  </tr>
  <tr>
    <td><strong>UI Components</strong></td>
    <td>
      <a href="https://coss.com">COSS</a> — ShadCN components built on <a href="https://base-ui.com">Base UI</a> primitives
    </td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>
      <a href="https://lucid.adonisjs.com">Lucid ORM</a> — SQL ORM with migrations (SQLite by default)
    </td>
  </tr>
  <tr>
    <td><strong>Auth</strong></td>
    <td>
      Session-based authentication with secure cookie storage
    </td>
  </tr>
  <tr>
    <td><strong>Styling</strong></td>
    <td>
      <a href="https://tailwindcss.com">Tailwind CSS 4</a> with CSS variables and dark mode support
    </td>
  </tr>
  <tr>
    <td><strong>Build</strong></td>
    <td>
      <a href="https://vitejs.dev">Vite</a> — Lightning-fast HMR and optimized builds
    </td>
  </tr>
  <tr>
    <td><strong>Validation</strong></td>
    <td>
      <a href="https://vinejs.dev">VineJS</a> — Type-safe schema validation
    </td>
  </tr>
  <tr>
    <td><strong>Type Safety</strong></td>
    <td>
      <a href="https://tuyau.dev">Tuyau</a> — End-to-end type safety for routes and API calls
    </td>
  </tr>
</table>

---

## 🚀 Quick Start

### Clone and Install

```bash
git clone <repo-url> my-app
cd my-app
npm install
```

### Configure Environment

```bash
cp .env.example .env
node ace generate:key
```

### Run Migrations

```bash
node ace migration:run
```

### Start Developing

```bash
# Run the development server with hot reload
node ace serve --hmr

# Run tests
node ace test

# Type check both backend and frontend
npm run typecheck

# Lint your code
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

Your app will be running at `http://localhost:3333`

---

## 🧩 ShadCN Setup for Inertia

ShadCN expects a standard Vite SPA or Next.js project structure. In an AdonisJS Inertia app, frontend code lives under `inertia/` instead of `src/`, which breaks the default ShadCN CLI.

This starter kit handles the configuration for you:

- **`components.json`** — Points ShadCN to the correct paths (`~/components/ui`, `~/lib/utils`) that resolve to the `inertia/` directory
- **Path aliases** — `tsconfig.json` maps `~/*` to `inertia/*`, matching what ShadCN expects
- **Tailwind CSS** — Configured with CSS variables and the `inertia/css/app.css` entry point
- **COSS registry** — Preconfigured so you can install Base UI-backed components directly

### Adding Components

```bash
# Add a standard ShadCN component
npx shadcn@latest add button

# Add a COSS component (Base UI-backed)
npx shadcn@latest add @coss/button
```

Components are installed to `inertia/components/ui/` and work immediately.

---

## 📝 Form Integration

The key feature of this starter kit is how it bridges Inertia's form handling with Base UI's form primitives.

### The Problem

Inertia provides a `<Form>` component that handles route-based submissions, CSRF tokens, processing state, and server-side validation errors. Base UI provides a `<Form>` primitive that distributes errors to `<Field>` components via context. Using them separately means either manual error wiring or losing one library's benefits.

### The Solution

The kit's `<Form>` component wraps both — Inertia handles the submission lifecycle, and Base UI handles error distribution:

```tsx
// inertia/components/ui/form.tsx
import { Form as FormPrimitive } from '@base-ui/react/form'
import { Form as InertiaForm } from '@adonisjs/inertia/react'

function Form({ className, children, ...inertiaProps }) {
  return (
    <InertiaForm {...inertiaProps}>
      {(slotProps) => (
        <FormPrimitive errors={slotProps.errors}>
          {typeof children === 'function' ? children(slotProps) : children}
        </FormPrimitive>
      )}
    </InertiaForm>
  )
}
```

Inertia's validation errors are passed directly to Base UI's `<FormPrimitive>`, which distributes them to matching `<Field>` components by name. The `<FieldError>` component renders the error automatically — no hooks, no manual state.

### Usage

```tsx
import { Form } from '~/components/ui/form'
import { Field, FieldLabel, FieldError } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

export default function Login() {
  return (
    <Form route="session.store">
      {({ processing }) => (
        <>
          <Field name="email">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input type="email" id="email" />
            <FieldError />
          </Field>

          <Field name="password">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input type="password" id="password" />
            <FieldError />
          </Field>

          <Button type="submit" disabled={processing}>
            Login
          </Button>
        </>
      )}
    </Form>
  )
}
```

- **`route`** — Type-safe route name (powered by Tuyau). The form submits to the correct URL and HTTP method automatically.
- **`processing`** — Boolean that's `true` while the form is submitting. Use it to disable the submit button.
- **`<Field name="email">`** — Matches the field name from your VineJS validator. Server errors for this field are scoped here.
- **`<FieldError />`** — Renders the validation error for its parent `<Field>`. No props needed — it reads from Base UI's form context.

---

## 📚 Learn More

<table>
  <tr>
    <td>
      <a href="https://docs.adonisjs.com"><strong>📖 AdonisJS Docs</strong></a>
      <br>
      <span>Complete guide to AdonisJS</span>
    </td>
    <td>
      <a href="https://inertiajs.com"><strong>🔄 Inertia.js</strong></a>
      <br>
      <span>Learn about server-driven SPAs</span>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://react.dev"><strong>⚛️ React Docs</strong></a>
      <br>
      <span>Modern React with hooks</span>
    </td>
    <td>
      <a href="https://coss.com"><strong>🧩 COSS</strong></a>
      <br>
      <span>ShadCN components on Base UI</span>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://base-ui.com"><strong>🔲 Base UI</strong></a>
      <br>
      <span>Headless UI primitives for React</span>
    </td>
    <td>
      <a href="https://tuyau.dev"><strong>🔒 Tuyau</strong></a>
      <br>
      <span>Type-safe routing and API calls</span>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://lucid.adonisjs.com"><strong>💾 Lucid ORM</strong></a>
      <br>
      <span>Database queries and relationships</span>
    </td>
    <td>
      <a href="https://vinejs.dev"><strong>✅ VineJS</strong></a>
      <br>
      <span>Schema validation guide</span>
    </td>
  </tr>
</table>

---

## 🎨 Philosophy

This starter kit embraces the **modern full-stack** approach to web development:

- **Server-Side Routing** — No API complexity, just controllers returning Inertia responses
- **Client-Side Experience** — React handles the UI with smooth SPA navigation
- **Headless Components** — Base UI primitives give you full control over styling without fighting a component library
- **Type Safety Everywhere** — TypeScript across frontend and backend with Tuyau integration
- **No Boilerplate Forms** — Server validation errors flow to UI components automatically, no hooks or manual wiring needed
- **Developer Experience** — Hot reload, great error messages, instant feedback

---

## 📄 License

This starter kit is open-sourced software licensed under the [MIT license](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ using AdonisJS</sub>
</div>
