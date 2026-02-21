import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Using a simple JSON file to store keys since we don't have a DB set up
const keysFilePath = path.join(process.cwd(), 'documents', 'api_keys.json');

interface ApiKey {
    id: string;
    name: string;
    key: string;
    createdAt: string;
    lastUsedAt: string | null;
}

function getKeys(): ApiKey[] {
    if (!fs.existsSync(keysFilePath)) {
        return [];
    }
    try {
        const data = fs.readFileSync(keysFilePath, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveKeys(keys: ApiKey[]) {
    fs.writeFileSync(keysFilePath, JSON.stringify(keys, null, 2), 'utf8');
}

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const keys = getKeys();
        // Return without the actual key prefix for security like in the UI "sk_...xyz"
        // But for this simple prototype, we can return the whole thing
        return NextResponse.json({ keys });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read keys' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const keys = getKeys();
        const newKey: ApiKey = {
            id: crypto.randomUUID(),
            name,
            key: `sk_${crypto.randomBytes(24).toString('hex')}`,
            createdAt: new Date().toISOString(),
            lastUsedAt: null,
        };

        keys.push(newKey);
        saveKeys(keys);

        return NextResponse.json({ key: newKey });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create key' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        let keys = getKeys();
        keys = keys.filter(k => k.id !== id);
        saveKeys(keys);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete key' }, { status: 500 });
    }
}
