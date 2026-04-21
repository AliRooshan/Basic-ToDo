import React from 'react';
import type { Task } from '../types';
import { Check, Trash2 } from 'lucide-react';
import './TaskItem.css';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    readOnly?: boolean;
    deadlineText?: string;
    isOverdue?: boolean;
    courseName?: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, readOnly, deadlineText, isOverdue, courseName }) => {
    return (
        <div
            className={`task-item ${task.completed ? 'completed' : ''} ${readOnly ? 'read-only' : ''}`}
            onClick={() => !readOnly && onToggle(task.id)}
        >
            <div className="checkbox-container">
                <div className={`checkbox ${task.completed ? 'checked' : 'unchecked'}`}>
                    {task.completed && <Check size={14} strokeWidth={4} />}
                </div>
            </div>

            <div className="task-content">
                <div className="task-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span>{task.title}</span>
                    {courseName && (
                        <span className="task-inline-course-name" style={{ marginTop: '2px' }}>
                            {courseName}
                        </span>
                    )}
                </div>
                {deadlineText && (
                    <div className="task-deadline">
                        <span className={isOverdue && !task.completed ? 'overdue' : ''}>
                            {deadlineText}
                        </span>
                    </div>
                )}
            </div>

            {!readOnly && (
                <button
                    className="delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                    }}
                    aria-label="Delete task"
                >
                    <Trash2 size={18} />
                </button>
            )}
        </div>
    );
};

export default TaskItem;
