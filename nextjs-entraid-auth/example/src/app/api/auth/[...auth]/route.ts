import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  return auth.handleAuth(request);
}

export async function POST(request: NextRequest) {
  return auth.handleAuth(request);
}