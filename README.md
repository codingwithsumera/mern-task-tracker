# MERN Task Tracker

A full-stack task management application built with React, Node.js, Express, and MongoDB. The application supports user registration, session-based authentication, and personal task management.

Each user can create, view, update, and delete their own tasks. Authentication is managed using secure server-side sessions stored in MongoDB.

## Features

### Task Management

- Create tasks with title validation.
- View tasks in a paginated list.
- Mark tasks as completed or pending.
- Delete tasks.
- Loading, empty, and error states.

### Authentication

- User registration and login.
- Password hashing using bcrypt.
- Session-based authentication using express-session.
- Session persistence across page refreshes.
- Logout functionality.
- Protected task routes.
- User-specific task ownership and access control.

## Tech Stack

- **Frontend:** React, Vite, JavaScript, Axios
- **State Management and Data Fetching:** TanStack Query
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** express-session, bcrypt, connect-mongo

## Project Structure

```text
mern-task-tracker/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskList.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── taskService.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
└── README.md
```

## Prerequisites

- Node.js and npm
- MongoDB local installation or MongoDB Atlas account
- Git

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/codingwithsumera/mern-task-tracker.git
cd mern-task-tracker
```

### 2. Configure backend environment variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_long_random_secret
```

Replace the placeholder values with your actual MongoDB connection string and a strong, random session secret.

Never commit your `.env` file or expose your credentials.

### 3. Install and run the backend

```bash
cd backend
npm install
npm run dev
```

The backend runs at:

`http://localhost:5000`

### 4. Install and run the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

`http://localhost:5173`

Keep both terminals running while using the application.

## API Endpoints

All API endpoints use the base URL:

`http://localhost:5000/api`

### Authentication

| Method | Endpoint         | Purpose                                   |
| ------ | ---------------- | ----------------------------------------- |
| POST   | `/auth/register` | Register a new user                       |
| POST   | `/auth/login`    | Authenticate a user                       |
| POST   | `/auth/logout`   | End the current session                   |
| GET    | `/auth/me`       | Retrieve the currently authenticated user |

### Tasks

All task endpoints require authentication.

| Method | Endpoint     | Purpose                           |
| ------ | ------------ | --------------------------------- |
| GET    | `/tasks`     | Retrieve the current user's tasks |
| POST   | `/tasks`     | Create a task                     |
| PATCH  | `/tasks/:id` | Update task completion status     |
| DELETE | `/tasks/:id` | Delete a task                     |

Task operations are restricted to the authenticated user's own tasks.

## Authentication and Session Flow

1. A user registers with their name, email, and password.
2. The backend hashes the password using bcrypt before storing it.
3. When the user logs in, the backend verifies the password.
4. Express Session creates a session and stores the authenticated user's ID.
5. Session data is stored in MongoDB using connect-mongo.
6. The browser stores the session cookie and sends it with subsequent API requests.
7. The frontend uses `/auth/me` to restore the authenticated user after a page refresh.
8. Logging out destroys the session.

The application uses session-based authentication rather than JWT authentication.

## Frontend Architecture

- **Axios:** A shared API instance handles HTTP requests and includes session credentials.
- **Auth Context:** Shares the authenticated user and authentication actions across components.
- **TanStack Query:** Handles server-state fetching, mutations, caching, and query invalidation.
- **Service Layer:** Separates authentication API calls from task API calls.

## Security and Data Ownership

- Passwords are stored as bcrypt hashes.
- Task routes are protected by authentication middleware.
- Every task is associated with an owner.
- Users can only retrieve, update, and delete their own tasks.
- Session data is stored in MongoDB.
- Database credentials and session secrets must remain private.

## Manual Testing Checklist

### Authentication

- Register a new account.
- Attempt registration with an existing email.
- Log in with valid credentials.
- Reject invalid login credentials.
- Refresh the page and confirm the session persists.
- Log out and confirm protected access is denied.

### Task Management

- Create a task.
- View the task list.
- Mark a task as completed.
- Mark a task as pending.
- Delete a task.
- Test pagination.
- Verify loading, empty, and error states.

### User Access Control

- Register two separate accounts.
- Create tasks using the first account.
- Log in using the second account.
- Confirm the second account cannot view the first account's tasks.
- Confirm users cannot update or delete another user's tasks.

## Notes

- Run backend and frontend commands in separate terminals.
- Keep environment variables inside the backend `.env` file.
- Never commit `.env`, database credentials, or `node_modules/`.
