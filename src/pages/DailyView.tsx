import React, { useState, useEffect } from 'react';
import { format, parseISO, isSameDay } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

import TaskItem from '../components/TaskItem';
import AddTaskModal from '../components/AddTaskModal';
import ConfirmModal from '../components/ConfirmModal';
import Header from '../components/Header';
import UniversityView from './UniversityView';
import type { Task, AppMode } from '../types';
import { fetchTasks, updateTask, deleteTask, processCarryOver, getMode, saveMode } from '../utils/storage';
import './DailyView.css';

const DailyView: React.FC = () => {
    const { logout } = useAuth();
    const [mode, setMode] = useState<AppMode>(getMode());
    // Always default to today
    const selectedDate = format(new Date(), 'yyyy-MM-dd');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        const hasChanges = await processCarryOver(allTasks);
        if (hasChanges) {
            const reloaded = await fetchTasks();
            setTasks(reloaded.filter(t => !t.courseId));
        } else {
            setTasks(allTasks.filter(t => !t.courseId));
        }
        setIsLoading(false);
    };

    const handleModeChange = (newMode: AppMode) => {
        setMode(newMode);
        saveMode(newMode);
    };

    const handleModalClose = async () => {
        setIsModalOpen(false);
        await loadTasks();
    };

    const handleToggleTask = async (id: string) => {
        const taskToToggle = tasks.find(t => t.id === id);
        if (taskToToggle) {
            const updatedTask = {
                ...taskToToggle,
                completed: !taskToToggle.completed,
                completedAt: !taskToToggle.completed ? new Date().toISOString() : null
            };

            // Optimistic update
            setTasks(tasks.map(t => t.id === id ? updatedTask : t));

            await updateTask(updatedTask);
        }
    };

    const handleDeleteTask = (id: string) => {
        setConfirmDelete({ show: true, taskId: id });
    };

    const confirmDeleteTask = async () => {
        if (confirmDelete.taskId) {
            // Optimistic update
            setTasks(tasks.filter(t => t.id !== confirmDelete.taskId));

            await deleteTask(confirmDelete.taskId);
        }
        setConfirmDelete({ show: false, taskId: null });
    };

    const cancelDelete = () => {
        setConfirmDelete({ show: false, taskId: null });
    };

    const currentDayTasks = tasks
        .filter(t => isSameDay(parseISO(t.date), parseISO(selectedDate)))
        .sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
        });

    return (
        <div className="daily-view page-container">
            <Header
                mode={mode}
                onModeChange={handleModeChange}
                logout={logout}
            />

            {mode === 'personal' ? (
                <>
                    <div className="daily-header-pill">
                        <div className="daily-header-content">
                            <span className="daily-header-label">Senior Project</span>
                        </div>
                    </div>

                    <main className="tasks-container">
                        <div className="tasks-list">
                            {isLoading ? (
                                <div className="empty-state">
                                    <span>Loading tasks...</span>
                                </div>
                            ) : currentDayTasks.length > 0 ? (
                                currentDayTasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onToggle={handleToggleTask}
                                        onDelete={handleDeleteTask}
                                        readOnly={false}
                                    />
                                ))
                            ) : (
                                <div className="empty-state">
                                    <span>No tasks yet</span>
                                </div>
                            )}
                        </div>
                    </main>

                    <button
                        className="fab"
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Add Task"
                    >
                        <Plus size={28} />
                    </button>

                    <AddTaskModal
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                    />
                </>
            ) : (
                <UniversityView />
            )}

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

export default DailyView;
