import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from './lib/supabase/config';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証が必要なページ
  const protectedPaths = ['/dashboard', '/users'];
  // 認証済みユーザーがアクセスできないページ
  const authPaths = ['/login', '/signup'];

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  // セッションの確認
  const res = await supabase.auth.getUser();

  if (isProtectedPath && !res) {
    // 認証が必要なページに未認証ユーザーがアクセスした場合
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPath && res.data.user) {
    // 認証済みユーザーがログインページなどにアクセスした場合
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}; 