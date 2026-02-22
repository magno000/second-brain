import { NextRequest, NextResponse } from 'next/server';
import { getAllDocuments, getDocumentStats, updateDocumentStatus, createDocument, DocumentStatus } from '@/lib/documents';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const documents = getAllDocuments();
        const stats = getDocumentStats();
        return NextResponse.json({ documents, stats });
    } catch (error) {
        console.error('Error reading documents:', error);
        return NextResponse.json({ error: 'Failed to read documents' }, { status: 500 });
    }
}

// ✅ NUEVO: Endpoint POST para crear documentos vía GitHub API
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, category, tags, status, date, content } = body;

        if (!title) {
            return NextResponse.json({ error: 'title is required' }, { status: 400 });
        }

        const newDoc = await createDocument({
            title,
            description,
            category,
            tags,
            status,
            date,
            content
        });

        if (!newDoc) {
            return NextResponse.json({ error: 'Failed to create document via GitHub API' }, { status: 500 });
        }

        return NextResponse.json({ success: true, document: newDoc });
    } catch (error) {
        console.error('Error creating document:', error);
        return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
    }

}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { slug, status } = body as { slug: string; status: DocumentStatus };

        if (!slug || !status) {
            return NextResponse.json({ error: 'slug and status are required' }, { status: 400 });
        }

        const validStatuses: DocumentStatus[] = ['todo', 'pending', 'in-progress', 'completed'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const updated = updateDocumentStatus(slug, status);
        if (!updated) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, slug, status });
    } catch (error) {
        console.error('Error updating document:', error);
        return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
    }
}
