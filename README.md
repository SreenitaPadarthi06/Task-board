# Task Board Application
A Kanban-style task management board built with React, featuring optimistic UI updates, drag-and-drop functionality, and Dockerized deployment.
---
## Features
- Task creation (Optimistic UI)
- Task editing (Optimistic UI)
- Task deletion (Optimistic UI)
- Drag and drop between columns
- Error handling with rollback
- Search filtering
- Dockerized production build

---
## Tech Stack
- React (Vite)
- Zustand (State Management)
- React DnD
- UUID
- Docker
- Nginx

---
## Running Locally

```bash
npm install
npm run dev
```
## Running with Docker

Build the image:

```bash
docker build -t task-board-app .
```

## Run the container:
```bash
docker run -p 9090:80 task-board-app
```

## Open in browser:

http://localhost:9090