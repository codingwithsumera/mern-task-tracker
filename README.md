# MERN Task Tracker

A simple task management application built with React, Node.js, Express,
MongoDB, and Mongoose. Users can create tasks, view a paginated task
list, mark tasks as completed or pending, and delete tasks. Task data is
stored in MongoDB, so it persists after refreshing the page.

## Features

- Create tasks with title validation.
- View tasks in a paginated list.
- Mark a task as completed or pending.
- Delete a task.
- Loading, empty, and error states in the React UI.
- REST API built with Express and Mongoose.
- MongoDB persistence.

## Tech stack

- **Frontend:** React, Vite, JavaScript, Fetch API
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose

## Project structure

mern-task-tracker/

## Project structure

mern-task-tracker/
├── backend/
│ ├── models/
│ │ └── Task.js
│ ├── routes/
│ │ └── tasks.js
│ ├── .env
│ ├── .gitignore
│ ├── package.json
│ └── server.js
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Pagination.jsx
│ │ │ ├── TaskForm.jsx
│ │ │ └── TaskList.jsx
│ │ ├── services/
│ │ │ └── taskService.js
│ │ ├── App.jsx
│ │ ├── App.css
│ │ ├── index.css
│ │ └── main.jsx
│ ├── index.html
│ └── package.json
└````

## Prerequisites

Install the following before running the project:

- Node.js and npm
- A MongoDB database, either a local MongoDB server or a MongoDB Atlas
  cluster
- Git (optional, for cloning the repository)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/codingwithsumera/mern-task-tracker.git
cd mern-task-tracker
```

### 2. Configure the backend environment

In the `backend/` directory, create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your MongoDB connection
string. Keep `.env` private and never commit database credentials.

### 3. Install backend dependencies and start the API

Open a terminal in the project root:

```bash
cd backend
npm install
node server.js
```

The API should connect to MongoDB and start on `http://localhost:5000`.
Keep this terminal running.

You can check the API health endpoint by opening:

```text
http://localhost:5000/
```

### 4. Install frontend dependencies and start React

Open a **second terminal** in the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal, usually
`http://localhost:5173`.

Keep both the backend and frontend terminals running while using the
app.

## API endpoints

The API base URL is `http://localhost:5000/api/tasks`.

---

Method Endpoint Purpose Expected success
response

---

`GET` `/api/tasks?page=1&limit=5` Get a paginated `200 OK`
task list

`POST` `/api/tasks` Create a task `201 Created`

`PATCH` `/api/tasks/:id` Change a task's `200 OK`
completion status
by ID

`DELETE` `/api/tasks/:id` Delete a task by `204 No Content`
ID
------------------------------------------------------------------------------------

### Example requests

Create a task:

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Review React hooks"
}
```

Mark a task as completed (replace `TASK_ID` with the task's MongoDB
`_id`):

```http
PATCH /api/tasks/TASK_ID
Content-Type: application/json

{
  "completed": true
}
```

Delete a task (replace `TASK_ID` with the task's MongoDB `_id`):

```http
DELETE /api/tasks/TASK_ID
```

The frontend obtains each task's `_id` from MongoDB and sends it when
the user marks a task complete/pending or deletes it. A separate "fetch
one task by ID" endpoint is not part of this assignment's API contract.

### Error handling

The API should use these status codes according to the assignment:

- `400 Bad Request` --- invalid input, such as a blank title or
  malformed task ID.
- `404 Not Found` --- task or route does not exist.
- `500 Internal Server Error` --- unexpected server or database error.

JSON error responses should include a `message` field. A successful
delete returns `204 No Content` with no response body.

## Manual verification checklist

- [ ] Create a task with a valid title.
- [ ] Try submitting a blank or whitespace-only title and confirm it
      is rejected.
- [ ] Confirm tasks appear in the list.
- [ ] Refresh the page and confirm saved tasks remain.
- [ ] Mark a task as completed, then mark it pending again.
- [ ] Delete a task and confirm it disappears.
- [ ] Create enough tasks to check the Previous/Next pagination
      controls and page totals.
- [ ] Confirm the UI displays loading, empty, and error states where
      applicable.
- [ ] Test malformed IDs and IDs that do not match an existing task
      through the API; confirm the appropriate JSON error and status code.
- [ ] Confirm the API returns `204 No Content` for a successful
      deletion.

## How the request flow works

For example, when a user marks a task as completed:

1.  The React component calls `updateTask(task._id, true)` in
    `frontend/src/services/taskService.js`.
2.  The service sends a `PATCH` request to `/api/tasks/:id` with a JSON
    body.
3.  Express matches the route in `backend/routes/tasks.js` and validates
    the ID and request body.
4.  Mongoose updates the matching task document in MongoDB.
5.  Express sends the updated task as JSON.
6.  The frontend reloads the task list and React renders the updated
    status.

## Notes

- Do not commit `.env`, database credentials, or `node_modules/`.
- Run backend commands from `backend/` and frontend commands from
  `frontend/`.
- If your `backend/package.json` defines a start script, you can use
  that script instead of `node server.js`.
