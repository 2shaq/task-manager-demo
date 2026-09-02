# Team Task Hub

A full-stack team task management app built with **Next.js (App Router)**, **TypeScript**, **Prisma**, and **PostgreSQL**. Users can register, log in, and manage tasks with priorities, statuses, and assignees.

> This repository hosts the Team Task Hub app used for the Replay QA security demo.

## Features

- Email/password authentication with hashed passwords (`bcryptjs`) and JWT sessions (`jsonwebtoken`)
- Create, read, update, and delete tasks
- Task attributes: title, description, priority, status, and assignee
- Per-user task isolation (tasks are scoped to the authenticated user)
- Modern UI built with Tailwind CSS and Radix UI components

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT + bcryptjs
- **Styling:** Tailwind CSS, Radix UI, lucide-react icons

## Project Structure

```
app/            # Next.js routes and API endpoints (auth, tasks, users, health)
components/     # Reusable UI components
hooks/          # Custom React hooks
lib/            # Utilities, database client, auth helpers
prisma/         # Prisma schema
scripts/        # Database seed scripts
public/         # Static assets
```

## Getting Started

### Prerequisites

- Node.js `>= 20.9.0`
- A PostgreSQL database
- [Yarn](https://yarnpkg.com/) (recommended) or npm

### 1. Install dependencies

```bash
yarn install
# or
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable       | Description                                   |
| -------------- | --------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma   |
| `JWT_SECRET`   | Secret used to sign/verify JWT auth tokens    |

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
```

Optionally seed sample data:

```bash
npx prisma db seed
```

### 4. Run the development server

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script          | Description                        |
| --------------- | ---------------------------------- |
| `yarn dev`      | Start the development server       |
| `yarn build`    | Create a production build          |
| `yarn start`    | Run the production build           |
| `yarn lint`     | Run ESLint                         |

## License

Private — for demo purposes.
