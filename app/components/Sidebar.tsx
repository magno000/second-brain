'use client';

import { DocumentStatus } from '@/lib/documents';
import {
    Activity,
    BookOpen,
    Brain,
    ChevronLeft,
    Key,
    Kanban,
    Lightbulb,
    Settings,
} from 'lucide-react';

interface Category {
    name: string;
    color: string;
}

interface SidebarProps {
    activeView: 'kanban' | 'documents' | 'settings' | 'api-keys';
    onViewChange: (view: 'kanban' | 'documents' | 'settings' | 'api-keys') => void;
    categories: Category[];
    selectedCategory: string | null;
    onCategorySelect: (cat: string | null) => void;
    isOpen: boolean;
    onClose: () => void;
    stats: { total: number; completed: number; inProgress: number; pending: number; todo: number };
}

const navItems = [
    { id: 'kanban', label: 'Kanban', icon: Kanban },
    { id: 'documents', label: 'Documentos', icon: BookOpen },
    { id: 'diario', label: 'Diario', icon: BookOpen },
    { id: 'modelos', label: 'Consejo de Modelos', icon: Lightbulb },
    { id: 'actividad', label: 'Feed de Actividad', icon: Activity },
] as const;

type NavId = typeof navItems[number]['id'] | 'settings' | 'api-keys';

interface ExtendedSidebarProps extends SidebarProps {
    activeNav: NavId;
    onNavChange: (id: NavId) => void;
}

export default function Sidebar({
    activeView,
    onViewChange,
    categories,
    selectedCategory,
    onCategorySelect,
    isOpen,
    onClose,
    stats,
    activeNav,
    onNavChange,
}: ExtendedSidebarProps) {
    function handleNavClick(id: NavId) {
        onNavChange(id);
        if (id === 'kanban' || id === 'documents' || id === 'settings' || id === 'api-keys') {
            onViewChange(id as 'kanban' | 'documents' | 'settings' | 'api-keys');
        }
        onClose();
    }

    return (
        <aside className={`sidebar${isOpen ? ' open' : ''}`}>
            {/* Logo */}
            <div className="sidebar-logo-section">
                <div className="sidebar-logo-icon">
                    <Brain size={18} color="white" strokeWidth={2} />
                </div>
                <div className="sidebar-logo-text">
                    <h1>Segundo Cerebro</h1>
                </div>
                <button className="sidebar-collapse-btn" onClick={onClose} aria-label="Cerrar menú">
                    <ChevronLeft size={16} />
                </button>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        className={`sidebar-nav-item${activeNav === id ? ' active' : ''}`}
                        onClick={() => handleNavClick(id)}
                    >
                        <Icon size={16} strokeWidth={1.8} />
                        <span>{label}</span>
                    </button>
                ))}
            </nav>

            {/* Categories */}
            <div className="sidebar-section-label">CATEGORÍAS</div>
            <div className="sidebar-categories">
                <button
                    className={`sidebar-cat-item${selectedCategory === null && (activeNav === 'kanban' || activeNav === 'documents') ? ' active' : ''}`}
                    onClick={() => {
                        onCategorySelect(null);
                        handleNavClick('kanban');
                    }}
                >
                    <span className="sidebar-cat-icon">📁</span>
                    <span>Todas</span>
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.name}
                        className={`sidebar-cat-item${selectedCategory === cat.name ? ' active' : ''}`}
                        onClick={() => {
                            onCategorySelect(cat.name);
                            handleNavClick('kanban');
                        }}
                    >
                        <span className="sidebar-cat-dot" style={{ background: cat.color }} />
                        <span>{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Stats mini */}
            <div className="sidebar-stats-mini">
                <span>{stats.total} docs</span>
                <span style={{ color: '#10b981' }}>{stats.completed} listos</span>
                <span style={{ color: '#f59e0b' }}>{stats.pending} pendientes</span>
            </div>

            {/* Bottom nav */}
            <div className="sidebar-bottom-nav">
                <button
                    className={`sidebar-nav-item${activeNav === 'settings' ? ' active' : ''}`}
                    onClick={() => handleNavClick('settings')}
                >
                    <Settings size={16} strokeWidth={1.8} />
                    <span>Configuración</span>
                </button>
                <button
                    className={`sidebar-nav-item${activeNav === 'api-keys' ? ' active' : ''}`}
                    onClick={() => handleNavClick('api-keys')}
                >
                    <Key size={16} strokeWidth={1.8} />
                    <span>Llaves API</span>
                </button>
            </div>
        </aside>
    );
}

export type { NavId, Category };
