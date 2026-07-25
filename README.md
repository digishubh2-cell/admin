# ShubhDigi Admin CMS

Standalone Next.js admin app for ShubhDigi content management.

## Run locally

Three processes (sibling folders under `ShubhDigi.in/`):

| App | Folder | Port |
|-----|--------|------|
| Backend API | `Backend/` | **5001** |
| Admin CMS | `admin/` | **3001** |
| Public website | `my-app/` | **3000** |

```powershell
# Terminal 1 — API
cd Backend
npm run dev

# Terminal 2 — Admin
cd admin
npm install
npm run dev

# Terminal 3 — Website (optional)
cd my-app
npm run dev
```

- Admin login: [http://localhost:3001/login](http://localhost:3001/login)
- API health: [http://localhost:5001/api/health](http://localhost:5001/api/health)

Ensure `Backend/.env` includes:

```
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

Admin `.env.local` should point at the API:

```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```
