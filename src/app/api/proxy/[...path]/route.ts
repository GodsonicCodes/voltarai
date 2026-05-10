import { NextRequest, NextResponse } from 'next/server';

const BACKEND = 'https://voltarai-vagent-2.onrender.com';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const targetUrl = `${BACKEND}/api/${path.join('/')}`;

    const body = await req.text();

    const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
    });

    const data = await res.text();
    return new NextResponse(data, {
        status: res.status,
        headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
    });
}

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const targetUrl = `${BACKEND}/api/${path.join('/')}`;

    const res = await fetch(targetUrl);
    const data = await res.text();
    return new NextResponse(data, {
        status: res.status,
        headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
    });
}
