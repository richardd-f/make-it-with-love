import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/src/auth';
import prisma from '@/src/lib/prisma';

/**
 * Benchmark-only CRUD endpoint — exists solely for the load-test "hard" phase.
 *
 * It performs a real authenticated Create -> Read -> Update -> Delete cycle
 * against Postgres via Prisma (using the throwaway UserAction tracking model,
 * which has no unique constraints and is safe to churn). This exercises the same
 * stack a real mutation does (NextAuth session check + Prisma write) without
 * adding a user-facing feature or mutating real domain data.
 *
 * Inert unless ENABLE_BENCHMARK_API=1, so it is a no-op (404) in production.
 * Gated by the real NextAuth session cookie, so k6 must complete the genuine
 * credentials login flow first.
 */

const ENABLED = process.env.ENABLE_BENCHMARK_API === '1';

function disabled() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

async function requireUser() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;
  return userId;
}

// CREATE
export async function POST() {
  if (!ENABLED) return disabled();
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const row = await prisma.userAction.create({
    data: { action: 'benchmark', details: 'created', userId },
  });
  return NextResponse.json({ id: row.id, details: row.details }, { status: 201 });
}

// READ
export async function GET(request: NextRequest) {
  if (!ENABLED) return disabled();
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = request.nextUrl.searchParams.get('id');
  if (id) {
    const row = await prisma.userAction.findFirst({ where: { id, userId } });
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ id: row.id, details: row.details });
  }

  const rows = await prisma.userAction.findMany({
    where: { userId, action: 'benchmark' },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return NextResponse.json({ count: rows.length });
}

// UPDATE
export async function PUT(request: NextRequest) {
  if (!ENABLED) return disabled();
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const existing = await prisma.userAction.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const row = await prisma.userAction.update({
    where: { id },
    data: { details: 'updated' },
  });
  return NextResponse.json({ id: row.id, details: row.details });
}

// DELETE (self-cleaning)
export async function DELETE(request: NextRequest) {
  if (!ENABLED) return disabled();
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const existing = await prisma.userAction.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.userAction.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
