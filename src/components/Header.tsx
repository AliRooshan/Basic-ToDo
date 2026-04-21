import React from 'react';
import { Leaf, LogOut } from 'lucide-react';
import './Header.css';

interface HeaderProps {
    mode: 'personal' | 'university';
    onModeChange: (mode: 'personal' | 'university') => void;
    logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ mode, onModeChange, logout }) => {
    return (
        <header className="app-unified-header">
            <div className="header-logo-section">
                <svg width="0" height="0" className="hidden-gradient">
                    <defs>
                        <linearGradient id="leaf-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#84A98C" />
                            <stop offset="100%" stopColor="#52796F" />
                        </linearGradient>
                    </defs>
                </svg>
                <Leaf className="header-logo-icon" size={24} style={{ stroke: 'url(#leaf-gradient)' }} />
                <span className="header-title">To Do</span>
            </div>

            <div className="header-tabs-container">
                <button
                    className={`header-tab ${mode === 'university' ? 'active' : ''}`}
                    onClick={() => onModeChange('university')}
                >
                    Courses
                </button>
                <button
                    className={`header-tab ${mode === 'personal' ? 'active' : ''}`}
                    onClick={() => onModeChange('personal')}
                >
                    Calendar
                </button>
            </div>

            <div className="header-logout-section">
                <button
                    onClick={logout}
                    className="header-logout-btn"
                    aria-label="Log out"
                    title="Sign Out"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;
