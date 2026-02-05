# KotWebsite (Mijn Kot)

A premium student housing platform for finding rooms in Ghent, Antwerp, and Leuven.

## 🚀 Technologies

This project is built with a modern, high-performance tech stack:

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite at the edge)
- **ORM**: Raw SQL / Typed queries
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

## 📂 Project Structure

The project follows a modular architecture using the Next.js App Router.

```
src/
├── app/            # Application routes & pages (Next.js App Router)
├── db/             # Database schemas and D1 SQL files
├── shared/         # Shared code (UI components, utility functions, hooks)
├── types/          # Global TypeScript type definitions
└── assets/         # Static assets
```

### Key Directories

- `src/app`: Contains the routing logic.
  - `admin/`: Admin dashboard routes.
  - `api/`: API route handlers (backend logic).
  - `koten/`: Student room listings.
  - `vestigingen/`: Property locations.
- `src/shared`: Reusable components and logic.
  - `ui/`: Design system components (Buttons, Cards, Inputs).
  - `lib/`: Helper functions and utilities.
- `src/db`:
  - `schema.d1.sql`: The main schema for Cloudflare D1.

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm**

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd KotWebsite
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running Locally

There are two ways to run the project, depending on your needs.

#### 1. Standard Development (Frontend Only)
Use this for quick frontend changes. Note that some backend features relying on Cloudflare services might mock or fail.
```bash
npm run dev
```
> Runs on `http://localhost:3001`

#### 2. Full Cloudflare Emulation (Recommended)
This simulates the Cloudflare environment, including the D1 database and other bindings. Use this for full-stack development.
```bash
npm run dev:wrangler
```
> Runs on `http://localhost:3000` (proxies to the Next.js dev server)

### Database Setup (D1)

To work with the local database:

1.  **Migrate local D1 database:**
    ```bash
    npm run d1:local:migrate
    ```

2.  **Seed data (Optional):**
    ```bash
    npm run seed
    ```

## 📜 Scripts Reference

| Script | Description |
| :--- | :--- |
| `dev` | Starts standard Next.js dev server. |
| `dev:wrangler` | Starts local Cloudflare Pages dev server with D1 support. |
| `build` | Builds the Next.js application. |
| `pages:build` | Builds the app for Cloudflare Pages (`@cloudflare/next-on-pages`). |
| `d1:local:migrate` | Applies schema changes to the local D1 database. |
| `d1:remote:migrate` | Applies schema changes to the production D1 database. |
