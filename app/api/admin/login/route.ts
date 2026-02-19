import { NextResponse } from 'next/server';
import { verifyPassword, getAdminPasswordHash, setSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }
    const hash = getAdminPasswordHash();
    const valid = await verifyPassword(password, hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    await setSession();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
