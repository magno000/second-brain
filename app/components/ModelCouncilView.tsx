import { useState } from 'react';
import { Send, Zap, Clock, Hash, CheckCircle2, AlertCircle, Sparkles, Trophy } from 'lucide-react';
import type { CouncilResponse } from '@/app/api/council/route';
import ReactMarkdown from 'react-markdown';

const AVAILABLE_MODELS = [
    { id: 'claude-opus-4.6', name: 'Claude Opus 4.6', color: '#d97757' },
    { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5', color: '#d97757' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', color: '#3b82f6' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', color: '#3b82f6' },
    { id: 'gpt-4o', name: 'GPT-4o', color: '#10b981' }
];

export default function ModelCouncilView() {
    const [prompt, setPrompt] = useState('');
    const [selectedModels, setSelectedModels] = useState<string[]>(['claude-sonnet-4.5', 'gemini-2.0-flash', 'gpt-4o']);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CouncilResponse | null>(null);

    const toggleModel = (id: string) => {
        setSelectedModels(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const handleAsk = async () => {
        if (!prompt.trim() || selectedModels.length === 0) return;

        setLoading(true);
        setResult(null);
        try {
            const res = await fetch('/api/council', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, models: selectedModels })
            });
            if (res.ok) {
                const data = await res.json();
                setResult(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getModelDetails = (id: string) => AVAILABLE_MODELS.find(m => m.id === id);

    return (
        <div className="council-view">
            <header className="council-header">
                <div className="council-icon">
                    <Zap size={24} color="#f59e0b" />
                </div>
                <div>
                    <h1 className="council-title">Consejo de Modelos</h1>
                    <p className="council-subtitle">Comparación y síntesis multi-modelo</p>
                </div>
            </header>

            <div className="council-content">
                <div className="council-input-section">
                    <textarea
                        className="council-textarea"
                        placeholder="Hazle una pregunta al consejo..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />

                    <div className="council-models-row">
                        {AVAILABLE_MODELS.map(model => (
                            <button
                                key={model.id}
                                className={`council-model-badge ${selectedModels.includes(model.id) ? 'active' : ''}`}
                                onClick={() => toggleModel(model.id)}
                                style={selectedModels.includes(model.id) ? { borderColor: model.color, background: `${model.color}15` } : {}}
                            >
                                <span className="model-dot" style={{ background: model.color }} />
                                {model.name}
                            </button>
                        ))}
                    </div>

                    <div className="council-input-footer">
                        <span className="council-count">{selectedModels.length} modelos seleccionados</span>
                        <button
                            className="council-submit-btn"
                            onClick={handleAsk}
                            disabled={loading || selectedModels.length === 0 || !prompt.trim()}
                        >
                            <Send size={16} />
                            {loading ? 'Consultando...' : 'Preguntar al Consejo'}
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="council-loading">
                        <div className="spinner"></div>
                        <p>Los modelos están deliberando...</p>
                    </div>
                )}

                {result && !loading && (
                    <div className="council-results">
                        {/* SYNTHESIS */}
                        <div className="council-section synthesis-section">
                            <h3 className="section-heading">Mejor Respuesta Sintetizada</h3>
                            <div className="synthesis-card">
                                <div className="synthesis-card-header">
                                    <Zap size={16} color="#f59e0b" />
                                    <span>Síntesis del Consejo</span>
                                </div>
                                <h2 className="synthesis-title">{result.synthesis.title}</h2>
                                <div className="markdown-body synthesis-content">
                                    <ReactMarkdown>{result.synthesis.content}</ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* RANKING */}
                        <div className="council-section">
                            <h3 className="section-heading"><Trophy size={18} color="#f59e0b" /> Ranking</h3>
                            <div className="ranking-list">
                                {result.ranking.map(rank => {
                                    const model = getModelDetails(rank.modelId);
                                    if (!model) return null;
                                    return (
                                        <div key={rank.modelId} className="ranking-item">
                                            <div className="ranking-medal">
                                                <div className={`medal medal-${rank.rank}`}>{rank.rank}</div>
                                            </div>
                                            <div className="ranking-content">
                                                <div className="ranking-model-name">
                                                    <span className="model-dot" style={{ background: model.color }} />
                                                    {model.name}
                                                </div>
                                                <p className="ranking-reason">{rank.reason}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* COMPARISON */}
                        <div className="council-section comparison-section">
                            <h3 className="section-heading">Comparación</h3>
                            <div className="comparison-card">

                                <h4 className="compare-subtitle success"><CheckCircle2 size={16} /> Áreas de Acuerdo</h4>
                                <ul className="compare-list">
                                    {result.comparison.agreements.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>

                                <h4 className="compare-subtitle warning"><AlertCircle size={16} /> Áreas de Desacuerdo</h4>
                                <ul className="compare-list">
                                    {result.comparison.disagreements.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>

                                <h4 className="compare-subtitle info"><Sparkles size={16} /> Perspectivas Únicas</h4>
                                <div className="unique-perspectives">
                                    {result.comparison.unique.map(u => {
                                        const m = getModelDetails(u.modelId);
                                        return (
                                            <div key={u.modelId} className="unique-block">
                                                <div className="unique-model" style={{ color: m?.color }}>{m?.name}:</div>
                                                <ul className="compare-list">
                                                    {u.points.map((p, i) => <li key={i}>{p}</li>)}
                                                </ul>
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>
                        </div>

                        {/* INDIVIDUAL RESPONSES */}
                        <div className="council-section">
                            <h3 className="section-heading">Respuestas Individuales</h3>
                            <div className="responses-grid">
                                {Object.entries(result.individual).map(([modelId, data]) => {
                                    const m = getModelDetails(modelId);
                                    if (!m || !selectedModels.includes(modelId)) return null;
                                    return (
                                        <div key={modelId} className="response-card">
                                            <div className="response-header">
                                                <div className="response-model-name">
                                                    <span className="model-dot" style={{ background: m.color }} />
                                                    {m.name}
                                                    <div className="response-score"><Trophy size={12} color="#f59e0b" /> {data.score}/10</div>
                                                </div>
                                            </div>
                                            <div className="markdown-body response-body">
                                                <ReactMarkdown>{data.content}</ReactMarkdown>
                                            </div>
                                            <div className="response-footer">
                                                <span><Clock size={12} /> {data.latency}</span>
                                                <span><Hash size={12} /> {data.tokens}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
