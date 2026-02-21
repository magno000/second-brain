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

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 100);
}

function ensureUniqueSlug(slug: string): string {
    let finalSlug = slug;
    let counter = 1;

    while (fs.existsSync(path.join(documentsDirectory, `${finalSlug}.md`))) {
        finalSlug = `${slug}-${counter}`;
        counter++;
    }

    return finalSlug;
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

// ✅ NUEVA FUNCIÓN: Crear documento
export function createDocument(doc: {
    title: string;
    description?: string;
    category?: string;
    tags?: string[];
    status?: DocumentStatus;
    date?: string;
    content?: string;
}): Document {
    ensureDocumentsDir();

    const slug = ensureUniqueSlug(generateSlug(doc.title));
    const date = doc.date || new Date().toISOString().split('T')[0];
    const status: DocumentStatus = doc.status || 'todo';

    const frontmatter = {
        title: doc.title,
        description: doc.description || '',
        category: doc.category || 'General',
        tags: doc.tags || [],
        status,
        date,
    };

    const fileContent = matter.stringify(doc.content || '', frontmatter);
    const fullPath = path.join(documentsDirectory, `${slug}.md`);

    fs.writeFileSync(fullPath, fileContent, 'utf8');

    return {
        slug,
        title: doc.title,
        status,
        tags: frontmatter.tags,
        date,
        description: frontmatter.description,
        category: frontmatter.category,
        content: doc.content || '',
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
        '#7c5cfc',
        '#10b981',
        '#f59e0b',
        '#3b82f6',
        '#ec4899',
        '#14b8a6',
        '#f97316',
        '#a78bfa',
    ];
    return Array.from(catSet).map((name, i) => ({
        name,
        color: palette[i % palette.length],
    }));
}