import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { isBefore, parseISO, startOfDay, format } from 'date-fns';
import type { Task, Course } from '../types';
import { fetchTasks, updateTask, deleteTask, getCourses } from '../utils/storage';
import TaskItem from '../components/TaskItem';
import CourseTaskModal from '../components/CourseTaskModal';
import ConfirmModal from '../components/ConfirmModal';
import './UniversityView.css';

const UniversityView: React.FC = () => {
    const [courses] = useState<Course[]>(getCourses());
    const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourseForModal, setSelectedCourseForModal] = useState<string | null>(null);
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
        setTasks(allTasks.filter(t => t.courseId));
        setIsLoading(false);
    };

    const handleModalClose = async () => {
        setIsModalOpen(false);
        setSelectedCourseForModal(null);
        await loadTasks();
    };

    const handleAddTask = (courseId: string) => {
        setSelectedCourseForModal(courseId);
        setIsModalOpen(true);
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

    const handlePrevCourse = () => {
        setSelectedCourseIndex((prev) => (prev > 0 ? prev - 1 : courses.length - 1));
    };

    const handleNextCourse = () => {
        setSelectedCourseIndex((prev) => (prev < courses.length - 1 ? prev + 1 : 0));
    };

    const getCourseTasks = (courseId: string) => {
        return tasks
            .filter(t => t.courseId === courseId)
            .sort((a, b) => {
                // Sort by deadline
                if (!a.deadline && !b.deadline) return 0;
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return parseISO(a.deadline).getTime() - parseISO(b.deadline).getTime();
            });
    };

    const selectedCourse = courses[selectedCourseIndex];
    const courseTasks = selectedCourse ? getCourseTasks(selectedCourse.id) : [];

    return (
        <div className="university-view">
            {/* Course Navigator */}
            <div className="course-navigator">
                <div className="course-navigator-controls">
                    <button onClick={handlePrevCourse} className="course-nav-btn" aria-label="Previous Course">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="current-course-display">
                        <span className="course-name-label">{selectedCourse?.name}</span>
                    </div>
                    <button onClick={handleNextCourse} className="course-nav-btn" aria-label="Next Course">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Single Course Card */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                    Loading tasks...
                </div>
            ) : (
                selectedCourse && (
                    <div
                        key={selectedCourse.id}
                        className="course-card content-card"
                    >
                        <div className="course-tasks">
                            {courseTasks.length > 0 ? (
                                courseTasks.map(task => (
                                    <div key={task.id} className="task-wrapper">
                                        <TaskItem
                                            task={task}
                                            onToggle={handleToggleTask}
                                            onDelete={handleDeleteTask}
                                            readOnly={false}
                                            deadlineText={task.deadline ? format(parseISO(task.deadline), 'EEEE, MMM d') : undefined}
                                            isOverdue={isOverdue(task.deadline)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <span>No tasks yet</span>
                                </div>
                            )}
                        </div>
                    </div>
                )
            )}

            <button
                className="fab"
                onClick={() => handleAddTask(selectedCourse?.id || '')}
                aria-label="Add Course Task"
            >
                <Plus size={28} />
            </button>

            <CourseTaskModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                courses={courses}
                initialCourseId={selectedCourseForModal}
            />

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

export default UniversityView;
