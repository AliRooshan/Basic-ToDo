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
                <Leaf className="header-logo-icon" size={24} />
                <span className="header-title">Daily Flow</span>
            </div>

            <div className="header-tabs-container">
                <button
                    className={`header-tab ${mode === 'personal' ? 'active' : ''}`}
                    onClick={() => onModeChange('personal')}
                >
                    Personal
                </button>
                <button
                    className={`header-tab ${mode === 'university' ? 'active' : ''}`}
                    onClick={() => onModeChange('university')}
                >
                    University
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
