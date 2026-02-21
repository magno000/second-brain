'use client';

import { DocumentStatus } from '@/lib/documents';

interface StatusBadgeProps {
    status: DocumentStatus;
    size?: 'sm' | 'md';
}

// 🔹 Todos los estados declarados
const labels: Record<DocumentStatus, string> = {
    todo: 'Por hacer',
    pending: 'Pendiente',
    'in-progress': 'En Progreso',
    completed: 'Completado',
};

const classMap: Record<DocumentStatus, string> = {
    todo: 'badge badge-todo',
    pending: 'badge badge-pending',
    'in-progress': 'badge badge-progress',
    completed: 'badge badge-completed',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span className={classMap[status]}>
            <span className="badge-dot" />
            {labels[status]}
        </span>
    );
}