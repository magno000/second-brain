import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const documentsDirectory = path.join(process.cwd(), 'documents');

export type DocumentStatus = 'todo' | 'pending' | 'in-progress' | 'completed';

export interface DocumentMeta {
    slug: string;
    title: string;
    status: DocumentStatus;
    tags: string[];
    date: string;
    description: string;
    category: string;
}

export interface Document extends DocumentMeta {
    content: string;
}

function ensureDocumentsDir() {
    if (!fs.existsSync(documentsDirectory)) {
        fs.mkdirSync(documentsDirectory, { recursive: true });
    }
}

export function getAllDocuments(): DocumentMeta[] {
    ensureDocumentsDir();

    const fileNames = fs.readdirSync(documentsDirectory).filter(f => f.endsWith('.md'));

    const documents = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(documentsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
            slug,
            title: data.title || slug,
            status: (data.status as DocumentStatus) || 'todo',
            tags: data.tags || [],
            date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
            description: data.description || '',
            category: data.category || (data.tags?.[0] ?? 'Sin Categoría'),
        };
    });

    // Sort by date descending
    return documents.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getDocumentBySlug(slug: string): Document | null {
    ensureDocumentsDir();

    const fullPath = path.join(documentsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        title: data.title || slug,
        status: (data.status as DocumentStatus) || 'todo',
        tags: data.tags || [],
        date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
        description: data.description || '',
        category: data.category || (data.tags?.[0] ?? 'Sin Categoría'),
        content,
    };
}

export function updateDocumentStatus(slug: string, status: DocumentStatus): boolean {
    ensureDocumentsDir();
    const fullPath = path.join(documentsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return false;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    data.status = status;

    const newFrontmatter = matter.stringify(content, data);
    fs.writeFileSync(fullPath, newFrontmatter, 'utf8');
    return true;
}

export function getDocumentStats() {
    const docs = getAllDocuments();
    return {
        total: docs.length,
        completed: docs.filter(d => d.status === 'completed').length,
        inProgress: docs.filter(d => d.status === 'in-progress').length,
        pending: docs.filter(d => d.status === 'pending').length,
        todo: docs.filter(d => d.status === 'todo').length,
    };
}

export function getAllCategories(): { name: string; color: string }[] {
    const docs = getAllDocuments();
    const catSet = new Set<string>();
    docs.forEach(d => catSet.add(d.category));

    const palette = [
        '#7c5cfc', '#10b981', '#f59e0b', '#3b82f6',
        '#ec4899', '#14b8a6', '#f97316', '#a78bfa',
    ];

    return Array.from(catSet).map((name, i) => ({
        name,
        color: palette[i % palette.length],
    }));
}
