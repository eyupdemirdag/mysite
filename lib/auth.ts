import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const ADMIN_COOKIE = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getAdminPasswordHash(): string {
  const raw = process.env.ADMIN_PASSWORD_HASH;
  if (!raw) {
    throw new Error('ADMIN_PASSWORD_HASH is not set. Run: node -e "require(\'bcryptjs\').hash(process.argv[1], 10).then(console.log)" "your-password"');
  }
  const hash = raw.trim().replace(/^["']|["']$/g, '');
  return hash;
}

export async function setSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE);
  return session?.value === '1';
}
