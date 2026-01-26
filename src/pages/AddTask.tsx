import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Sparkles, Leaf } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { addTask } from '../utils/storage';
import type { Task } from '../types';
import './AddTask.css';

const AddTask: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialDate = location.state?.initialDate || format(new Date(), 'yyyy-MM-dd');

    const [title, setTitle] = useState('');
    const [date, setDate] = useState(initialDate);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const newTask: Task = {
            id: '', // DB-generated
            title: title.trim(),
            date,
            completed: false,
            createdAt: Date.now()
        };

        await addTask(newTask);

        setIsSubmitting(false);
        navigate('/');
    };

    return (
        <motion.div
            className="add-task-page page-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <header className="app-main-header">
                <Leaf className="app-logo" size={28} />
                <span className="app-title">Daily Flow</span>
            </header>

            <motion.button
                onClick={() => navigate('/')}
                className="home-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Go Home"
            >
                <Home size={24} />
            </motion.button>

            <header className="add-header">
                <h2>New Task</h2>
            </header>

            <div className="content-card form-card">
                <form onSubmit={handleSubmit} className="task-form">
                    <div className="form-group">
                        <label htmlFor="task-date" className="date-label">
                            <Calendar size={18} className="icon-pulse" />
                            <span>Scheduled For</span>
                        </label>
                        <input
                            type="date"
                            id="task-date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="date-input"
                            required
                            min={format(new Date(), 'yyyy-MM-dd')}
                        />
                    </div>

                    <div className="form-group main-input">
                        <textarea
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="title-input"
                            autoFocus
                            rows={3}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                        />
                    </div>

                    <div className="actions">
                        <motion.button
                            type="submit"
                            className="save-btn"
                            disabled={!title.trim()}
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(99, 102, 241, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Sparkles size={18} style={{ marginRight: '8px' }} />
                            Schedule Task
                        </motion.button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default AddTask;
