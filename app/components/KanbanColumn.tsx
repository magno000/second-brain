'use client';

import { DocumentMeta, DocumentStatus } from '@/lib/documents';
import { Plus } from 'lucide-react';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
    id: DocumentStatus;
    title: string;
    color: string;
    docs: DocumentMeta[];
    isOver: boolean;
    onSelect: (slug: string) => void;
    onDragStart: (e: React.DragEvent, slug: string, fromStatus: DocumentStatus) => void;
    onDragOver: (e: React.DragEvent, targetStatus: DocumentStatus) => void;
    onDrop: (e: React.DragEvent, targetStatus: DocumentStatus) => void;
    onDragLeave: () => void;
}

export default function KanbanColumn({
    id,
    title,
    color,
    docs,
    isOver,
    onSelect,
    onDragStart,
    onDragOver,
    onDrop,
    onDragLeave,
}: KanbanColumnProps) {
    return (
        <div
            className={`kanban-column${isOver ? ' kanban-column-over' : ''}`}
            onDragOver={(e) => onDragOver(e, id)}
            onDrop={(e) => onDrop(e, id)}
            onDragLeave={onDragLeave}
        >
            {/* Column header */}
            <div className="kanban-column-header">
                <div className="kanban-column-title-row">
                    <span className="kanban-column-dot" style={{ background: color }} />
                    <span className="kanban-column-title">{title}</span>
                    <span className="kanban-column-count">{docs.length}</span>
                </div>
                <button className="kanban-column-menu" aria-label="Opciones de columna">···</button>
            </div>

            {/* Cards */}
            <div className="kanban-cards">
                {docs.map((doc) => (
                    <KanbanCard
                        key={doc.slug}
                        doc={doc}
                        onSelect={onSelect}
                        onDragStart={onDragStart}
                    />
                ))}

                {/* Drop hint when empty */}
                {docs.length === 0 && (
                    <div className="kanban-empty-col">
                        Arrastra tarjetas aquí
                    </div>
                )}
            </div>

            {/* Add button */}
            <button className="kanban-add-btn">
                <Plus size={14} />
                Agregar documento
            </button>
        </div>
    );
}
