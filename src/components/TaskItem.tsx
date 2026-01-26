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
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, readOnly, deadlineText, isOverdue }) => {
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
                <div className="task-title">
                    {task.title}
                </div>
                {deadlineText && (
                    <div className={`task-deadline ${isOverdue && !task.completed ? 'overdue' : ''}`}>
                        {deadlineText}
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
