import React, { useState, useEffect } from 'react';
import { isBefore, parseISO, startOfDay, format } from 'date-fns';
import type { Task, Course } from '../types';
import { fetchTasks, updateTask, deleteTask, getCourses } from '../utils/storage';
import TaskItem from '../components/TaskItem';
import ConfirmModal from '../components/ConfirmModal';
import './CalendarView.css';

const CalendarView: React.FC = () => {
    const [courses] = useState<Course[]>(getCourses());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; taskId: string | null }>({
        show: false,
        taskId: null
    });

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setIsLoading(true);
        const allTasks = await fetchTasks();
        setTasks(allTasks.filter(t => t.courseId));
        setIsLoading(false);
    };

    const handleToggleTask = async (id: string) => {
        const taskToToggle = tasks.find(t => t.id === id);
        if (taskToToggle) {
            const updatedTask = {
                ...taskToToggle,
                completed: !taskToToggle.completed,
                completedAt: !taskToToggle.completed ? new Date().toISOString() : null
            };

            setTasks(tasks.map(t => t.id === id ? updatedTask : t));
            await updateTask(updatedTask);
        }
    };

    const handleDeleteTask = (id: string) => {
        setConfirmDelete({ show: true, taskId: id });
    };

    const confirmDeleteTask = async () => {
        if (confirmDelete.taskId) {
            setTasks(tasks.filter(t => t.id !== confirmDelete.taskId));
            await deleteTask(confirmDelete.taskId);
        }
        setConfirmDelete({ show: false, taskId: null });
    };

    const cancelDelete = () => {
        setConfirmDelete({ show: false, taskId: null });
    };

    const isOverdue = (deadline: string | undefined): boolean => {
        if (!deadline) return false;
        const deadlineDate = parseISO(deadline);
        const today = startOfDay(new Date());
        return isBefore(deadlineDate, today);
    };

    // Filter uncompleted tasks
    const uncompletedTasks = tasks.filter(t => !t.completed);

    // Group by deadline, lumping overdue tasks together
    const groupedTasks = uncompletedTasks.reduce((acc, task) => {
        const isOverdueTask = isOverdue(task.deadline);
        const dateKey = isOverdueTask ? 'OVERDUE' : (task.deadline || 'NO_DATE');
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(task);
        return acc;
    }, {} as Record<string, Task[]>);

    // Sort dates (OVERDUE first -> earliest date first -> NO_DATE last)
    const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
        if (a === 'OVERDUE') return -1;
        if (b === 'OVERDUE') return 1;
        if (a === 'NO_DATE') return 1;
        if (b === 'NO_DATE') return -1;
        return parseISO(a).getTime() - parseISO(b).getTime();
    });

    const getCourseName = (courseId?: string) => {
        const course = courses.find(c => c.id === courseId);
        return course ? course.name : 'Unknown Course';
    };

    return (
        <div className="calendar-view">
            <div className="calendar-container">
                {isLoading ? (
                    <div className="empty-state">
                        <span>Loading tasks...</span>
                    </div>
                ) : sortedDates.length > 0 ? (
                    sortedDates.map(dateKey => {
                        const dateTasks = groupedTasks[dateKey];
                        const dateLabel = dateKey === 'OVERDUE'
                            ? 'Deadline Exceeded'
                            : dateKey === 'NO_DATE'
                                ? 'No Deadline'
                                : format(parseISO(dateKey), 'EEEE, MMMM d, yyyy');

                        return (
                            <div key={dateKey} className="date-group-card content-card">
                                <div className="date-group-header">
                                    <h3 className={dateKey === 'OVERDUE' ? 'overdue-header' : ''}>
                                        {dateLabel}
                                    </h3>
                                </div>
                                <div className="course-tasks">
                                    {dateTasks.map(task => (
                                        <div key={task.id} className="task-wrapper">
                                            <TaskItem
                                                task={task}
                                                onToggle={handleToggleTask}
                                                onDelete={handleDeleteTask}
                                                readOnly={false}
                                                courseName={getCourseName(task.courseId)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-state content-card" style={{ padding: '3rem 1rem' }}>
                        <span>No upcoming course tasks! 🎉</span>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={confirmDelete.show}
                onConfirm={confirmDeleteTask}
                onCancel={cancelDelete}
                title="Delete Task?"
                message="This action cannot be undone. Are you sure you want to delete this task?"
            />
        </div>
    );
};

export default CalendarView;
