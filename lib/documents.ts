import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const documentsDirectory = path.join(process.cwd(), 'documents');

// GitHub API Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = 'magno000';
const GITHUB_REPO = 'second-brain';

// ✅ CORRECCIÓN: faltaban las comillas invertidas (template string)
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

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

// Get file SHA from GitHub for updates
async function getFileSha(filePath: string): Promise<string | null> {
    try {
        // ✅ CORRECCIÓN: template string mal formado
        const response = await fetch(
            `${GITHUB_API_BASE}/contents/${filePath}`,
            {
                headers: {
                    // ✅ CORRECCIÓN: Authorization mal escrita
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        if (response.status === 404) {
            return null;
        }

        const data = await response.json();
        return data.sha;

    } catch (error) {
        console.error('Error getting file SHA:', error);
        return null;
    }
}

// Create or update file via GitHub API
async function createOrUpdateFile(
    filePath: string,
    content: string,
    message: string
): Promise<boolean> {
    try {
        const encodedContent = Buffer.from(content, 'utf8').toString('base64');
        const sha = await getFileSha(filePath);

        const body: any = {
            message,
            content: encodedContent,
            branch: 'main',
        };

        if (sha) {
            body.sha = sha;
        }

        const response = await fetch(
            `${GITHUB_API_BASE}/contents/${filePath}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('GitHub API error:', errorData);
            return false;
        }

        return true;

    } catch (error) {
        console.error('Error creating/updating file:', error);
        return false;
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

    return documents.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getDocumentBySlug(slug: string): Document | null {
    ensureDocumentsDir();

    // ✅ CORRECCIÓN: template string roto
    const fullPath = path.join(documentsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) return null;

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

// ✅ FUNCIÓN CORREGIDA: Crear documento vía GitHub API
export async function createDocument(doc: {
    title: string;
    description?: string;
    category?: string;
    tags?: string[];
    status?: DocumentStatus;
    date?: string;
    content?: string;
}): Promise<Document | null> {

    const slug = generateSlug(doc.title);
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

    // ✅ CORRECCIÓN: ruta mal formada
    const filePath = `documents/${slug}.md`;

    // ✅ CORRECCIÓN: string mal cerrado
    const commitMessage = `docs: add "${doc.title}" via API`;

    const success = await createOrUpdateFile(filePath, fileContent, commitMessage);

    if (!success) return null;

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

    // ✅ CORRECCIÓN: template string roto
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