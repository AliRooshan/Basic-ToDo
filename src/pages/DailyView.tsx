import React, { useState, useEffect } from 'react';
import { format, isBefore, startOfDay, parseISO, isSameDay } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

import DateNavigator from '../components/DateNavigator';
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
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; taskId: string | null }>({
        show: false,
        taskId: null
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setIsLoading(true);
        const allTasks = await fetchTasks();
        const hasChanges = await processCarryOver(allTasks);
        if (hasChanges) {
            // Re-fetch to get updated dates? Or just trust processCarryOver returns? 
            // processCarryOver in my impl returns boolean. 
            // Ideally processCarryOver should return updated list or we re-fetch.
            // Let's re-fetch to be safe and simple.
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

    const currentDayTasks = tasks.filter(t => isSameDay(parseISO(t.date), parseISO(selectedDate)));

    const today = startOfDay(new Date());
    const selectedDateObj = parseISO(selectedDate);
    const isPast = isBefore(selectedDateObj, today);

    return (
        <div className="daily-view page-container">
            <Header
                mode={mode}
                onModeChange={handleModeChange}
                logout={logout}
            />

            {mode === 'personal' ? (
                <>
                    <DateNavigator selectedDate={selectedDate} onSelectDate={setSelectedDate} />

                    <main className="tasks-container">
                        {isLoading ? (
                            <div className="loading-state">
                                <span>Loading tasks...</span>
                            </div>
                        ) : (
                            <div className="tasks-list">
                                {currentDayTasks.length > 0 ? (
                                    currentDayTasks.map(task => (
                                        <TaskItem
                                            key={task.id}
                                            task={task}
                                            onToggle={handleToggleTask}
                                            onDelete={handleDeleteTask}
                                            readOnly={isPast}
                                        />
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <span>No tasks yet</span>
                                    </div>
                                )}
                            </div>
                        )}
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
                        initialDate={selectedDate}
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
