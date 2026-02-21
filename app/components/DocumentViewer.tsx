'use client';

import { Document } from '@/lib/documents';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Brain, Calendar, Check, Copy, FileText, Menu } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import StatusBadge from './StatusBadge';

interface DocumentViewerProps {
    doc: Document | null;
    isLoading: boolean;
    onMenuOpen: () => void;
    onBack?: () => void;
}

export default function DocumentViewer({ doc, isLoading, onMenuOpen, onBack }: DocumentViewerProps) {
    const [copied, setCopied] = useState(false);

    function formatDate(dateStr: string) {
        try {
            return format(parseISO(dateStr), "d 'de' MMMM, yyyy", { locale: es });
        } catch {
            return dateStr;
        }
    }

    async function handleCopy() {
        if (!doc) return;
        const text = `# ${doc.title}\n\n${doc.content}`;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    }

    function handleExport() {
        if (!doc) return;
        const text = `---\ntitle: "${doc.title}"\nstatus: "${doc.status}"\ntags: [${doc.tags.map((t) => `"${t}"`).join(', ')}]\ndate: "${doc.date}"\n---\n\n${doc.content}`;
        const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `${doc.slug}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }

    if (isLoading) {
        return (
            <div className="main-content">
                <header className="content-header">
                    <button className="menu-btn" onClick={onMenuOpen} aria-label="Abrir menú">
                        <Menu size={20} />
                    </button>
                </header>
                <div className="loading-screen">
                    <div className="spinner" />
                    <span style={{ fontSize: '0.85rem' }}>Cargando documento...</span>
                </div>
            </div>
        );
    }

    if (!doc) {
        return (
            <div className="main-content">
                <header className="content-header">
                    <div className="content-header-left">
                        <button className="menu-btn" onClick={onMenuOpen} aria-label="Abrir menú">
                            <Menu size={20} />
                        </button>
                        <span className="breadcrumb">
                            <span>Segundo Cerebro</span>
                        </span>
                    </div>
                </header>
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <Brain size={32} color="var(--accent)" strokeWidth={1.5} />
                    </div>
                    <h2>Selecciona un documento</h2>
                    <p>
                        Elige un documento del panel izquierdo para comenzar a leer. OpenClaw irá
                        añadiendo nuevos documentos automáticamente.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content">
            {/* Top bar */}
            <header className="content-header">
                <div className="content-header-left">
                    <button className="menu-btn" onClick={onMenuOpen} aria-label="Abrir menú">
                        <Menu size={20} />
                    </button>
                    <span className="breadcrumb">
                        {onBack && (
                            <button className="btn btn-ghost" onClick={onBack} style={{ padding: '4px 8px', marginRight: 4 }}>
                                ← Volver
                            </button>
                        )}
                        <FileText size={13} />
                        <span>Segundo Cerebro</span>
                        <span>/</span>
                        <span className="breadcrumb-current">{doc.title}</span>
                    </span>
                </div>
                <div className="content-header-right">
                    <button className="btn btn-ghost" onClick={handleCopy} title="Copiar contenido">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copied ? 'Copiado' : 'Copiar'}</span>
                    </button>
                    <button className="btn btn-primary" onClick={handleExport} title="Exportar como .md">
                        <span>Exportar .md</span>
                    </button>
                </div>
            </header>

            {/* Document content */}
            <div className="viewer">
                <div className="doc-header">
                    <h1 className="doc-title">{doc.title}</h1>

                    <div className="doc-meta-row">
                        <StatusBadge status={doc.status} />
                        <span className="doc-date">
                            <Calendar size={12} />
                            {formatDate(doc.date)}
                        </span>
                    </div>

                    {doc.tags.length > 0 && (
                        <div className="doc-tags">
                            {doc.tags.map((tag) => (
                                <span key={tag} className="tag">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {doc.description && (
                        <div className="doc-description">{doc.description}</div>
                    )}
                </div>

                <div className="doc-divider" />

                <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.content}</ReactMarkdown>
                </div>
            </div>

            {/* Copied toast */}
            {copied && (
                <div className="toast">
                    <Check size={14} color="var(--status-completed)" />
                    Contenido copiado al portapapeles
                </div>
            )}
        </div>
    );
}
