# Simple Task Management API


## Setup

1. Clone / copy files into a folder.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and update `MONGO_URI` and `JWT_SECRET`.
4. Start dev server: `npm run dev` (requires nodemon) or `npm start`.

-----------------------------------------------------------------
## Endpoints
- `POST /api/auth/register` — register (body: name, email, password)
- `POST /api/auth/login` — login (body: email, password) -> returns
`{ token }`
- **(protected)** `GET /api/tasks` — list tasks (supports `?
status=Completed&priority=High`)
- **(protected)** `POST /api/tasks` — create task (body: title, description,dueDate, status, priority,category,tags)
- **(protected)** `PUT /api/tasks/:id` — update task
- **(protected)** `DELETE /api/tasks/:id` — delete task
Use the Authorization header: `Bearer <token>` for protected routes.
