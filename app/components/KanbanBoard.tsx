'use client';

import { DocumentMeta, DocumentStatus } from '@/lib/documents';
import { useCallback, useState } from 'react';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
    documents: DocumentMeta[];
    onSelectDoc: (slug: string) => void;
    onStatusChange: (slug: string, newStatus: DocumentStatus) => void;
}

const COLUMNS: { id: DocumentStatus; title: string; color: string }[] = [
    { id: 'todo', title: 'Todos', color: '#9898b0' },
    { id: 'pending', title: 'Pendiente', color: '#f59e0b' },
    { id: 'in-progress', title: 'En Progreso', color: '#3b82f6' },
    { id: 'completed', title: 'Completadas', color: '#10b981' },
];

export default function KanbanBoard({ documents, onSelectDoc, onStatusChange }: KanbanBoardProps) {
    const [dragging, setDragging] = useState<{ slug: string; fromStatus: DocumentStatus } | null>(null);
    const [overCol, setOverCol] = useState<DocumentStatus | null>(null);

    const handleDragStart = useCallback(
        (e: React.DragEvent, slug: string, fromStatus: DocumentStatus) => {
            setDragging({ slug, fromStatus });
            e.dataTransfer.effectAllowed = 'move';
        },
        []
    );

    const handleDragOver = useCallback((e: React.DragEvent, targetStatus: DocumentStatus) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setOverCol(targetStatus);
    }, []);

    const handleDrop = useCallback(
        async (e: React.DragEvent, targetStatus: DocumentStatus) => {
            e.preventDefault();
            setOverCol(null);

            if (!dragging || dragging.fromStatus === targetStatus) {
                setDragging(null);
                return;
            }

            const { slug } = dragging;
            setDragging(null);

            // Optimistic update
            onStatusChange(slug, targetStatus);

            // Persist to server
            try {
                await fetch('/api/documents', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug, status: targetStatus }),
                });
            } catch (err) {
                console.error('Failed to update status:', err);
                // Revert on error
                onStatusChange(slug, dragging.fromStatus);
            }
        },
        [dragging, onStatusChange]
    );

    const handleDragLeave = useCallback(() => {
        setOverCol(null);
    }, []);

    return (
        <div className="kanban-board">
            {COLUMNS.map((col) => (
                <KanbanColumn
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    color={col.color}
                    docs={documents.filter((d) => d.status === col.id)}
                    isOver={overCol === col.id}
                    onSelect={onSelectDoc}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragLeave={handleDragLeave}
                />
            ))}
        </div>
    );
}
