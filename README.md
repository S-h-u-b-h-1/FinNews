# FinNews

Simple Medium-like news application (React + Vite + Tailwind frontend, Express + Prisma backend) with authentication, article feeds, client-side search, filters, pagination and sorting.

**Repository:** FinNews

---

**Features**

- User authentication (signup / login) using JWT
- Articles feed with Featured and Trending sections
- Client-side search (debounced, tokenized, normalized matching)
- Multi-select tag filters and author filtering
- Pagination (default 5 articles per page)
- Sorting by date (newest / oldest)
- URL persistence for filters, page and sort state
- Simple newsletter subscribe UI and basic site pages (About, PreLogin)

**Tech stack**

- Frontend: React (Vite), Tailwind CSS, react-router-dom
- Backend: Node.js, Express, Prisma (Postgres), bcryptjs, jsonwebtoken
- Dev: nodemon, Vite dev server

---

**Quick start (development)**

Prerequisites:

- Node.js (LTS, e.g. v18 or v20 recommended)
- npm
- MySQL for production / Prisma migrations (optional for local mock/demo)

1) Start the backend

```bash
cd backend
npm install
# Create a .env with required variables (see Environment variables below)
npm run dev
```

The backend runs by default on `http://localhost:5001` in development when using the included scripts.

2) Start the frontend

```bash
cd frontend
npm install
# Ensure VITE_API_BASE_URL points to your backend (see frontend/.env)
npm run dev
```

The frontend Vite dev server runs on a port printed to console (commonly `http://localhost:3000` or `http://localhost:5173`).

Notes about CORS and local dev

- If you run the frontend locally and use a remotely deployed backend, make sure the deployed backend allows your local origin (for example `http://localhost:3000`) in its CORS settings. The backend includes a `FRONTEND_URL` env variable to control allowed origins.
- Alternatively run the backend locally and point `VITE_API_BASE_URL` to `http://localhost:5001` for full local E2E testing.

---

**Environment variables**

Backend (`/backend/.env`)

- `DATABASE_URL` — Prisma/Postgres connection string
- `JWT_SECRET` — secret used to sign JWT tokens
- `FRONTEND_URL` — comma-separated allowed frontend origins (e.g. `http://localhost:3000,https://your-deployed-frontend`)

Frontend (`/frontend/.env`)

- `VITE_API_BASE_URL` — URL of backend API (e.g. `http://localhost:5001` or `https://your-deployed-backend`)

Make sure to restart servers after updating env vars.

---

**Database & Prisma**

- The project uses Prisma as the ORM. When using Postgres, run migrations like:

```bash
cd backend
npx prisma migrate dev --name init
```

If you only want to run the app with the seeded/dummy article data present in the frontend (no DB), you can skip Prisma and run frontend-only mode.

---

**Available scripts**

Root: none (work in subfolders)

Backend

- `npm run dev` — start backend in development (nodemon)
- `npm start` — start backend (production)

Frontend

- `npm run dev` — start Vite dev server
- `npm run build` — create production build
- `npm preview` — preview production build

---

**Deployment notes**

- The frontend can be deployed to Vercel, Netlify, or similar static hosts. Set `VITE_API_BASE_URL` to the deployed backend URL.
- The backend can be deployed to Render, Heroku, or similar. Ensure the `FRONTEND_URL` env includes your deployed frontend origin and any local dev origins you want to allow.

---

**Troubleshooting**

- If the browser reports CORS preflight errors when calling the deployed backend from localhost, either: (1) add your local origin to the backend's `FRONTEND_URL` and redeploy the backend, or (2) run the backend locally and point the frontend to `http://localhost:5001`.
- If Vite's dev server exits unexpectedly in your environment, try upgrading/downgrading Node to an LTS version (v18 or v20) or run `npm run dev` locally on your machine.

---

**Contributing**

- Fork, create a branch, implement features or fixes, and open a pull request. Include clear summaries and reproduction steps for bug fixes.

**License**

- No license specified. Add a `LICENSE` file if you want to make this project open-source under a specific license.

---

If you'd like, I can also:

- add a short `README` for the `backend` and `frontend` subfolders with more detailed env examples, or
- create example `.env.example` files to make setup easier.