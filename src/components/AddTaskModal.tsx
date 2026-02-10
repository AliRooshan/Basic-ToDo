import React, { useState } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { addTask } from '../utils/storage';
import type { Task } from '../types';
import './AddTaskModal.css';

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    // initialDate removed as not used
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    // Always use today's date for Personal tasks
    const [date] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const newTask: Task = {
            id: '', // database will generate
            title: title.trim(),
            date,
            completed: false,
            createdAt: Date.now()
        };

        await addTask(newTask);

        setIsSubmitting(false);
        setTitle('');
        onClose();
    };

    const handleClose = () => {
        setTitle('');
        onClose();
    };

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
                            <h3>New Task</h3>
                            <button className="close-btn" onClick={handleClose} aria-label="Close">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            {/* Date input removed as it is always Today for Personal tasks */}

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

export default AddTaskModal;
