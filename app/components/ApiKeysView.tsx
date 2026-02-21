'use client';

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Check, Copy, Key, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavId } from './Sidebar';

interface ApiKeysViewProps {
    onNavChange: (id: NavId) => void;
}

interface ApiKey {
    id: string;
    name: string;
    key: string;
    createdAt: string;
    lastUsedAt: string | null;
}

export default function ApiKeysView({ onNavChange }: ApiKeysViewProps) {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    useEffect(() => {
        loadKeys();
    }, []);

    async function loadKeys() {
        try {
            const res = await fetch('/api/keys');
            if (res.ok) {
                const data = await res.json();
                setKeys(data.keys || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleGenerate() {
        setGenerating(true);
        try {
            const res = await fetch('/api/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'tablero_agente' }),
            });
            if (res.ok) {
                loadKeys();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setGenerating(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Seguro que deseas eliminar esta llave API? Se romperán las integraciones que la usen.')) return;
        try {
            const res = await fetch(`/api/keys?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setKeys((prev) => prev.filter((k) => k.id !== id));
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function handleCopy(text: string, id: string) {
        await navigator.clipboard.writeText(text);
        setCopiedKey(id);
        setTimeout(() => setCopiedKey(null), 2000);
    }

    function formatDate(dateStr: string) {
        try {
            return format(parseISO(dateStr), "MMM d, yyyy, hh:mm a", { locale: es });
        } catch {
            return dateStr;
        }
    }

    return (
        <div className="settings-view">
            <header className="settings-header">
                <button className="settings-back-btn" onClick={() => onNavChange('settings')}>
                    <ArrowLeft size={20} />
                </button>
                <div className="settings-icon">
                    <Key size={24} color="var(--accent)" />
                </div>
                <div>
                    <h1 className="settings-title">Llaves API</h1>
                    <p className="settings-subtitle">Administra llaves API para integraciones externas</p>
                </div>
            </header>

            <div className="settings-content">
                <div className="api-info-box">
                    <span className="api-info-icon">ⓘ</span>
                    <p>
                        <strong>Las llaves API se usan para integraciones externas</strong><br />
                        Dale a tu agente de IA una llave API para permitirle crear y actualizar documentos en tu segundo cerebro.
                    </p>
                </div>

                <button
                    className="api-gen-btn"
                    onClick={handleGenerate}
                    disabled={generating}
                >
                    <Plus size={16} />
                    {generating ? 'Generando...' : 'Generar Nueva Llave API'}
                </button>

                <div className="api-keys-section">
                    <h3 className="settings-section-title">Llaves Existentes ({keys.length})</h3>

                    {loading ? (
                        <p className="text-muted">Cargando llaves...</p>
                    ) : keys.length === 0 ? (
                        <p className="text-muted">No tienes llaves API generadas.</p>
                    ) : (
                        <div className="api-keys-list">
                            {keys.map((k) => (
                                <div key={k.id} className="api-key-item">
                                    <div className="api-key-item-left">
                                        <div className="api-key-name-row">
                                            <span className="api-key-name">{k.name}</span>
                                            <code className="api-key-value" onClick={() => handleCopy(k.key, k.id)} title="Copiar llave">
                                                {k.key}
                                                {copiedKey === k.id ? <Check size={12} color="var(--status-completed)" /> : <Copy size={12} />}
                                            </code>
                                        </div>
                                        <div className="api-key-meta">
                                            Creada {formatDate(k.createdAt)}
                                        </div>
                                    </div>
                                    <button className="api-key-delete" onClick={() => handleDelete(k.id)} aria-label="Eliminar" title="Eliminar llave">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="api-docs-section">
                    <h3 className="settings-section-title">Cómo usar tu llave API</h3>
                    <p className="settings-doc-text">
                        Incluye tu llave API en el header <code className="doc-code">Authorization</code>:
                    </p>
                    <pre className="doc-pre">
                        <code>Authorization: Bearer sk_your_api_key_here</code>
                    </pre>

                    <p className="settings-doc-text" style={{ marginTop: 24 }}>Ejemplos de llamadas API:</p>

                    <div className="doc-terminal">
                        <div className="doc-terminal-comment"># Crear un documento</div>
                        <code>
                            curl -X POST https://your-domain.vercel.app/api/documents \<br />
                            -H "Authorization: Bearer sk_your_key" \<br />
                            -H "Content-Type: application/json" \<br />
                            -d '{"{"}"title": "My Note", "content": "# Hello\n\nThis is my note.", "category": "concepts"{"}"}'
                        </code>
                        <br /><br />
                        <div className="doc-terminal-comment"># Actualizar estado de documento (Kanban)</div>
                        <code>
                            curl -X PATCH https://your-domain.vercel.app/api/documents \<br />
                            -H "Authorization: Bearer sk_your_key" \<br />
                            -H "Content-Type: application/json" \<br />
                            -d '{"{"}"slug": "my-note", "status": "in-progress"{"}"}'
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
}
