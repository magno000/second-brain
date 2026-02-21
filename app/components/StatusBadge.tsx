'use client';

import { DocumentStatus } from '@/lib/documents';

interface StatusBadgeProps {
    status: DocumentStatus;
    size?: 'sm' | 'md';
}

const labels: Record<DocumentStatus, string> = {
    pending: 'Pendiente',
    'in-progress': 'En Progreso',
    completed: 'Completado',
};

const classMap: Record<DocumentStatus, string> = {
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
