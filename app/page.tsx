'use client';

import { Document, DocumentMeta, DocumentStatus, getAllCategories } from '@/lib/documents';
import { useCallback, useEffect, useState } from 'react';
import DocumentViewer from './components/DocumentViewer';
import KanbanBoard from './components/KanbanBoard';
import Sidebar, { Category, NavId } from './components/Sidebar';
import ConfiguracionView from './components/ConfiguracionView';
import ApiKeysView from './components/ApiKeysView';

interface DocsResponse {
  documents: DocumentMeta[];
  stats: { total: number; completed: number; inProgress: number; pending: number; todo: number };
}

export default function Home() {
  const [data, setData] = useState<DocsResponse | null>(null);
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavId>('kanban');
  const [activeView, setActiveView] = useState<'kanban' | 'documents' | 'settings' | 'api-keys'>('kanban');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load documents
  useEffect(() => {
    fetch('/api/documents')
      .then((r) => r.json())
      .then((d: DocsResponse) => {
        setData(d);
        setDocuments(d.documents);
        // Derive categories from documents
        const catMap = new Map<string, string>();
        const palette = [
          '#7c5cfc', '#10b981', '#f59e0b', '#3b82f6',
          '#ec4899', '#14b8a6', '#f97316', '#a78bfa',
        ];
        let idx = 0;
        d.documents.forEach((doc) => {
          const cat = (doc as DocumentMeta & { category?: string }).category ?? doc.tags[0] ?? 'Sin Categoría';
          if (!catMap.has(cat)) {
            catMap.set(cat, palette[idx % palette.length]);
            idx++;
          }
        });
        setCategories(Array.from(catMap.entries()).map(([name, color]) => ({ name, color })));
      })
      .catch(console.error);
  }, []);

  const handleSelectDoc = useCallback(async (slug: string) => {
    setSelectedSlug(slug);
    setLoadingDoc(true);
    setActiveView('documents');
    setActiveNav('documents');
    setSidebarOpen(false);
    try {
      const res = await fetch(`/api/documents/${slug}`);
      const doc: Document = await res.json();
      setSelectedDoc(doc);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDoc(false);
    }
  }, []);

  // Optimistic status change from drag-and-drop
  const handleStatusChange = useCallback((slug: string, newStatus: DocumentStatus) => {
    setDocuments((prev) =>
      prev.map((d) => (d.slug === slug ? { ...d, status: newStatus } : d))
    );
  }, []);

  const handleViewChange = useCallback((view: 'kanban' | 'documents' | 'settings' | 'api-keys') => {
    setActiveView(view);
    if (view === 'kanban') {
      setSelectedDoc(null);
      setSelectedSlug(null);
    }
  }, []);

  // Filter by category if one is selected
  const visibleDocs = selectedCategory
    ? documents.filter((d) => {
      const cat = (d as DocumentMeta & { category?: string }).category ?? d.tags[0] ?? 'Sin Categoría';
      return cat === selectedCategory;
    })
    : documents;

  const stats = data?.stats ?? { total: 0, completed: 0, inProgress: 0, pending: 0, todo: 0 };

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        stats={stats}
        activeNav={activeNav}
        onNavChange={setActiveNav}
      />

      {/* Main area */}
      <main className="main-area">
        {activeView === 'kanban' && (
          <div className="kanban-view">
            {/* Kanban header */}
            <div className="kanban-view-header">
              <div className="kanban-view-header-left">
                <button
                  className="menu-btn"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Abrir menú"
                >
                  ☰
                </button>
                <div>
                  <h2 className="kanban-view-title">Tablero de Conocimiento</h2>
                  <p className="kanban-view-subtitle">
                    {visibleDocs.length} documento{visibleDocs.length !== 1 ? 's' : ''} en {categories.length} categoría{categories.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="kanban-view-header-right">
                <div className="kanban-search-box">
                  <span>🔍</span>
                  <input placeholder="Buscar..." className="kanban-search-input" />
                </div>
              </div>
            </div>

            <KanbanBoard
              documents={visibleDocs}
              onSelectDoc={handleSelectDoc}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}

        {activeView === 'documents' && (
          <DocumentViewer
            doc={selectedDoc}
            isLoading={loadingDoc}
            onMenuOpen={() => setSidebarOpen(true)}
            onBack={() => handleViewChange('kanban')}
          />
        )}

        {activeView === 'settings' && (
          <ConfiguracionView
            onNavChange={(id) => {
              setActiveNav(id);
              if (id === 'api-keys') handleViewChange('api-keys');
            }}
          />
        )}

        {activeView === 'api-keys' && (
          <ApiKeysView
            onNavChange={(id) => {
              setActiveNav(id);
              if (id === 'settings') handleViewChange('settings');
            }}
          />
        )}
      </main>
    </div>
  );
}
