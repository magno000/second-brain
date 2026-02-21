import { NextResponse } from 'next/server';
import { getDocumentBySlug } from '@/lib/documents';

export const dynamic = 'force-dynamic';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const document = getDocumentBySlug(slug);

        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        return NextResponse.json(document);
    } catch (error) {
        console.error('Error reading document:', error);
        return NextResponse.json({ error: 'Failed to read document' }, { status: 500 });
    }
}
