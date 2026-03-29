import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const locale = body.locale as string;
  const validLocales = ['en', 'pt'];

  if (!validLocales.includes(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('locale', locale, {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
  });
  return response;
}
