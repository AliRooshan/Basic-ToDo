import React from 'react';
import type { AppMode } from '../types';
import './ModeToggle.css';

interface ModeToggleProps {
    mode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
    return (
        <div className="mode-toggle-container">
            <button
                className={`mode-option ${mode === 'personal' ? 'active' : ''}`}
                onClick={() => onModeChange('personal')}
            >
                Personal
            </button>
            <button
                className={`mode-option ${mode === 'university' ? 'active' : ''}`}
                onClick={() => onModeChange('university')}
            >
                University
            </button>
            <div className={`mode-slider ${mode === 'university' ? 'right' : 'left'}`} />
        </div>
    );
};

export default ModeToggle;
