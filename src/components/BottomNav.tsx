import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

export const BottomNav: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/exercises', label: 'Exercises', icon: '💪' },
        { path: '/progress', label: 'Progress', icon: '📊' },
        { path: '/settings', label: 'Settings', icon: '⚙️' }
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map(item => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                    <span className="bottom-nav-icon">{item.icon}</span>
                    <span className="bottom-nav-label">{item.label}</span>
                </Link>
            ))}
        </nav>
    );
};
