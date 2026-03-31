import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

const navItems = [
    { path: '/',          label: 'Sessions', icon: 'exercise'    },
    { path: '/exercises', label: 'Routine',  icon: 'trending_up' },
    { path: '/progress',  label: 'History',  icon: 'history'     },
    { path: '/settings',  label: 'Profile',  icon: 'person'      },
];

export const BottomNav: React.FC = () => {
    const location = useLocation();

    if (location.pathname.startsWith('/timer')) {
        return null;
    }

    return (
        <nav className="bottom-nav">
            {navItems.map(item => {
                const isActive = item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span
                            className="material-symbols-outlined nav-icon"
                            style={isActive
                                ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
                                : undefined
                            }
                        >
                            {item.icon}
                        </span>
                        <span className="nav-label">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};
