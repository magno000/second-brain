'use client';

import { DocumentMeta, DocumentStatus } from '@/lib/documents';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, FileText, GripVertical } from 'lucide-react';

interface KanbanCardProps {
    doc: DocumentMeta;
    onSelect: (slug: string) => void;
    onDragStart: (e: React.DragEvent, slug: string, fromStatus: DocumentStatus) => void;
}

const categoryColors: Record<string, string> = {};
const palette = [
    '#7c5cfc', '#10b981', '#f59e0b', '#3b82f6',
    '#ec4899', '#14b8a6', '#f97316', '#a78bfa',
];
let colorIdx = 0;

function getCategoryColor(cat: string): string {
    if (!categoryColors[cat]) {
        categoryColors[cat] = palette[colorIdx % palette.length];
        colorIdx++;
    }
    return categoryColors[cat];
}

function formatDate(dateStr: string) {
    try {
        return format(parseISO(dateStr), 'd MMM, yyyy', { locale: es });
    } catch {
        return dateStr;
    }
}

export default function KanbanCard({ doc, onSelect, onDragStart }: KanbanCardProps) {
    const catColor = getCategoryColor(doc.category);

    return (
        <div
            className="kanban-card"
            draggable
            onDragStart={(e) => onDragStart(e, doc.slug, doc.status)}
            onClick={() => onSelect(doc.slug)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(doc.slug)}
            aria-label={`Abrir documento: ${doc.title}`}
        >
            {/* Card header */}
            <div className="kanban-card-header">
                <span
                    className="kanban-card-category"
                    style={{ color: catColor, borderColor: `${catColor}44`, background: `${catColor}18` }}
                >
                    {doc.category}
                </span>
                <GripVertical size={13} className="kanban-card-grip" />
            </div>

            {/* Title */}
            <div className="kanban-card-title">{doc.title}</div>

            {/* Description or tags */}
            {doc.description && (
                <div className="kanban-card-desc">{doc.description.slice(0, 90)}{doc.description.length > 90 ? '…' : ''}</div>
            )}

            {/* Footer */}
            <div className="kanban-card-footer">
                <span className="kanban-card-date">
                    <Calendar size={11} />
                    {formatDate(doc.date)}
                </span>
                {doc.tags.length > 0 && (
                    <span className="kanban-card-tags">
                        <FileText size={11} />
                        {doc.tags.slice(0, 2).join(', ')}
                    </span>
                )}
            </div>
        </div>
    );
}
