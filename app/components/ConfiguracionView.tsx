'use client';

import { ChevronRight, Database, Key, Palette, Settings } from 'lucide-react';
import { NavId } from './Sidebar';

interface ConfiguracionViewProps {
    onNavChange: (id: NavId) => void;
}

export default function ConfiguracionView({ onNavChange }: ConfiguracionViewProps) {
    return (
        <div className="settings-view">
            <header className="settings-header">
                <div className="settings-icon">
                    <Settings size={24} color="var(--accent)" />
                </div>
                <div>
                    <h1 className="settings-title">Configuración</h1>
                    <p className="settings-subtitle">Configura tu segundo cerebro</p>
                </div>
            </header>

            <div className="settings-list">
                {/* Llaves API */}
                <button className="settings-list-item" onClick={() => onNavChange('api-keys')}>
                    <div className="settings-item-icon">
                        <Key size={18} />
                    </div>
                    <div className="settings-item-content">
                        <div className="settings-item-title">Llaves API</div>
                        <div className="settings-item-desc">Administra llaves API para integraciones externas</div>
                    </div>
                    <ChevronRight size={18} color="var(--text-muted)" />
                </button>

                {/* Base de Datos (Disabled) */}
                <div className="settings-list-item disabled">
                    <div className="settings-item-icon">
                        <Database size={18} />
                    </div>
                    <div className="settings-item-content">
                        <div className="settings-item-title">Base de Datos <span className="badge-soon">Próximamente</span></div>
                        <div className="settings-item-desc">Ver estadísticas de la base de datos y administrar almacenamiento</div>
                    </div>
                    <ChevronRight size={18} color="var(--text-muted)" />
                </div>

                {/* Apariencia (Disabled) */}
                <div className="settings-list-item disabled">
                    <div className="settings-item-icon">
                        <Palette size={18} />
                    </div>
                    <div className="settings-item-content">
                        <div className="settings-item-title">Apariencia <span className="badge-soon">Próximamente</span></div>
                        <div className="settings-item-desc">Personaliza la apariencia de tu segundo cerebro</div>
                    </div>
                    <ChevronRight size={18} color="var(--text-muted)" />
                </div>
            </div>
        </div>
    );
}
