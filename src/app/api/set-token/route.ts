// app/api/set-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { encrypt } from '@/utils/encryption';

export async function POST(req: NextRequest) {
    console.log(req.body)
    const body = await req.json();
    const token = body.token;
    const session = req.cookies.get("__session")?.value;
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 })
    }
    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const encrypted = encrypt(token);

    const res = NextResponse.json({ success: true });
    res.cookies.set('ac_token', encrypted, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 1h
    });

    return res;
}
