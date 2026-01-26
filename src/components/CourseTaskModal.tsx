import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Course, Task } from '../types';
import { addTask } from '../utils/storage';
import './CourseTaskModal.css';

interface CourseTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    courses: Course[];
    initialCourseId: string | null;
}

const CourseTaskModal: React.FC<CourseTaskModalProps> = ({
    isOpen,
    onClose,
    courses,
    initialCourseId
}) => {
    const [title, setTitle] = useState('');
    const [courseId, setCourseId] = useState(initialCourseId || courses[0]?.id || '');
    const [deadline, setDeadline] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialCourseId) {
            setCourseId(initialCourseId);
        }
    }, [initialCourseId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !courseId || isSubmitting) return;

        setIsSubmitting(true);
        const newTask: Task = {
            id: '', // DB gen
            title: title.trim(),
            date: format(new Date(), 'yyyy-MM-dd'),
            deadline: deadline,
            courseId: courseId,
            completed: false,
            createdAt: Date.now()
        };

        await addTask(newTask);

        setIsSubmitting(false);
        setTitle('');
        setDeadline(format(new Date(), 'yyyy-MM-dd'));
        onClose();
    };

    const handleClose = () => {
        setTitle('');
        setDeadline(format(new Date(), 'yyyy-MM-dd'));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {isOpen && (
                <>
                    <div
                        className="modal-backdrop"
                        onClick={handleClose}
                    />
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Add Course Task</h3>
                            <button className="close-btn" onClick={handleClose} aria-label="Close">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group-modal">
                                <label htmlFor="task-deadline-modal" className="date-label-modal">
                                    <Calendar size={16} />
                                    <span>Deadline</span>
                                </label>
                                <input
                                    type="date"
                                    id="task-deadline-modal"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="date-input-modal"
                                    required
                                    min={format(new Date(), 'yyyy-MM-dd')}
                                />
                            </div>

                            <div className="form-group-modal">
                                <textarea
                                    placeholder="What needs to be done?"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="title-input-modal"
                                    autoFocus
                                    rows={2}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e);
                                        }
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="submit-btn-modal"
                            >
                                Schedule Task
                            </button>
                        </form>
                    </div>
                </>
            )}
        </>
    );
};

export default CourseTaskModal;
