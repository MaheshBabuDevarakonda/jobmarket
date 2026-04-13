# JobOps — Full Stack Job Management System

A production-grade job management platform with real-time CRUD, analytics dashboards, JWT authentication, and role-based access.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Chart.js         |
| Backend    | Node.js, Express.js                            |
| Database   | MongoDB + Mongoose                             |
| Auth       | JWT (JSON Web Tokens) + bcryptjs               |
| Charts     | Chart.js + react-chartjs-2                     |
| HTTP       | Axios with interceptors                        |
| Deployment | Vercel (frontend) + Render (backend)           |

---

## Project Structure

```
job-management/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/auth.js    # JWT protect middleware
│   ├── models/
│   │   ├── User.js           # User schema (bcrypt hashing)
│   │   └── Job.js            # Job schema with indexes
│   ├── routes/
│   │   ├── auth.js           # /api/auth/register|login|me
│   │   └── jobs.js           # /api/jobs CRUD + analytics
│   ├── server.js             # Express app entry
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/axios.js      # Axios instance + interceptors
│   │   ├── context/          # AuthContext (login/register/logout)
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx  # KPIs + recent jobs + status bars
│   │   │   ├── Jobs.jsx       # CRUD with filter + pagination
│   │   │   └── Analytics.jsx  # 6 charts + location table
│   │   ├── App.jsx            # BrowserRouter + protected routes
│   │   └── main.jsx
│   └── index.html
└── README.md
```

---

## API Reference

### Auth

| Method | Endpoint              | Body                         | Auth |
|--------|-----------------------|------------------------------|------|
| POST   | /api/auth/register    | name, email, password        | ✗    |
| POST   | /api/auth/login       | email, password              | ✗    |
| GET    | /api/auth/me          | —                            | ✓    |

### Jobs

| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| GET    | /api/jobs             | List jobs (filter, search, paginate)     |
| POST   | /api/jobs             | Create a new job                         |
| PUT    | /api/jobs/:id         | Update a job                             |
| DELETE | /api/jobs/:id         | Delete a job                             |
| GET    | /api/jobs/analytics   | Aggregated analytics data                |

**Query params for GET /api/jobs:**
- `search` — full-text search (title, desc, location)
- `status` — Pending | In Progress | Completed | Cancelled
- `workType` — Construction | Electrical | ... etc.
- `page`, `limit`, `sort`

---

## Local Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd job-management

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Backend Environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env:
# MONGO_URI=mongodb://localhost:27017/jobmanagement
# JWT_SECRET=your_super_secret_key
# PORT=5000
```

### 3. Run Dev Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Frontend → http://localhost:5173  
Backend → http://localhost:5000

---

## Deployment

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo, set root dir to `backend/`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`

### Frontend → Vercel

1. Import repo on [vercel.com](https://vercel.com)
2. Set root dir to `frontend/`
3. Add env var: `VITE_API_URL=https://your-render-api.onrender.com/api`
4. Deploy!

---

## Features

- **Authentication** — JWT login/register with bcrypt password hashing
- **Job CRUD** — Create, read, update, delete with modal forms
- **Filtering** — Search by keyword, filter by status & work type
- **Pagination** — Server-side with page controls
- **Analytics** — 6 charts: work type distribution, workers deployed, status doughnut, priority doughnut, location bar, 30-day trend line
- **Dashboard** — KPI cards, status progress bars, top work types, recent jobs
- **Responsive** — Mobile-first layout, collapsible nav
- **Priority system** — Low / Medium / High / Critical with visual indicators

---

## Job Fields

| Field           | Type     | Required | Notes                        |
|-----------------|----------|----------|------------------------------|
| title           | String   | ✓        |                              |
| workType        | String   | ✓        | 11 categories                |
| location        | String   | ✓        |                              |
| date            | Date     | ✓        |                              |
| workers         | Number   | ✓        | Min: 1                       |
| status          | String   | —        | Default: Pending             |
| priority        | String   | —        | Default: Medium              |
| description     | String   | —        | Max 500 chars                |
| estimatedHours  | Number   | —        |                              |
