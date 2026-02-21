import { NextRequest, NextResponse } from 'next/server';
import { getAllDocuments, getDocumentStats, updateDocumentStatus, DocumentStatus } from '@/lib/documents';

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
