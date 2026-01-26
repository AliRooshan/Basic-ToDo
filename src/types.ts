export type AppMode = 'personal' | 'university';

export interface Course {
    id: string;
    name: string;
    color: string;
}

export interface Task {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD (for personal mode)
    deadline?: string; // YYYY-MM-DD (for university mode)
    courseId?: string; // For university mode
    completed: boolean;
    createdAt: number;
    completedAt?: string | null;
}

export interface DayStats {
    date: string;
    total: number;
    completed: number;
}
