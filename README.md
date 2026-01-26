# Daily Flow

Daily Flow is a personal task management application designed to help balance University coursework and Personal daily habits. It features a clean, aesthetic interface and seamless cross-device synchronization.

## ✨ Features

- **Dual Modes**: 
  - **Personal View**: Manage daily tasks with a date-based navigator.
  - **University View**: Organize tasks by course with deadline tracking.
- **Cross-Device Sync**: Tasks are stored in the cloud (Supabase), allowing you to access your schedule from any device.
- **Simplified Authentication**: A unique single-password system (`rooshybazinga`) that automatically links to your personal cloud account.
- **Progress Tracking**: Visual indicators for completed tasks and habits.

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: CSS Modules, Lucide React (Icons), Framer Motion (Animations)
- **Backend/Database**: Supabase (PostgreSQL + Auth)
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- A Supabase project set up

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd todo
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

## ☁️ Supabase Setup

This project uses Supabase for storing tasks.

**1. Authentication Settings**
- Go to `Authentication` > `Providers` > `Email`.
- **Disable** "Confirm email".
- This is required for the auto-login flow to work seamlessly.

**2. Database Schema**
Run the following SQL in your Supabase SQL Editor to create the necessary table:

```sql
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date text,
  deadline text,
  course_id text,
  completed boolean default false,
  created_at bigint,
  completed_at text,
  user_id uuid references auth.users not null
);

alter table public.tasks enable row level security;

create policy "Users can see their own tasks"
on public.tasks for select using ( auth.uid() = user_id );

create policy "Users can insert their own tasks"
on public.tasks for insert with check ( auth.uid() = user_id );

create policy "Users can update their own tasks"
on public.tasks for update using ( auth.uid() = user_id );

create policy "Users can delete their own tasks"
on public.tasks for delete using ( auth.uid() = user_id );
```

## 🔐 Credentials

- **Client URL**: Configured in `src/supabaseClient.ts`
- **Anon Key**: Configured in `src/supabaseClient.ts`
- **Login Password**: `rooshybazinga`
