import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

/**
 * Benchmark-only CRUD endpoint — exists solely for the load-test "hard" phase.
 *
 * Exercises a real Create -> Read -> Update -> Delete cycle against Postgres via
 * Prisma (UserAction model, no unique constraints, safe to churn). No session
 * auth required — the ENABLE_BENCHMARK_API=1 env gate keeps this inert (404)
 * in production. Rows are keyed to the bench seed account looked up by email.
 */

const ENABLED = process.env.ENABLE_BENCHMARK_API === '1';
const BENCH_EMAIL = process.env.BENCH_EMAIL ?? 'bench@makeitwithlove.com';

function disabled() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

async function getBenchUserId(): Promise<string | null> {
  const user = await prisma.user.findFirst({
    where: { email: BENCH_EMAIL },
    select: { userId: true },
  });
  return user?.userId ?? null;
}

// CREATE
export async function POST() {
  if (!ENABLED) return disabled();
  const userId = await getBenchUserId();
  if (!userId)
    return NextResponse.json(
      { error: 'Bench user not found — run the bench seed first' },
      { status: 503 }
    );

  const row = await prisma.userAction.create({
    data: { action: 'benchmark', details: 'created', userId },
  });
  return NextResponse.json({ id: row.id, details: row.details }, { status: 201 });
}

// READ
export async function GET(request: NextRequest) {
  if (!ENABLED) return disabled();
  const userId = await getBenchUserId();
  if (!userId)
    return NextResponse.json(
      { error: 'Bench user not found — run the bench seed first' },
      { status: 503 }
    );

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
  const userId = await getBenchUserId();
  if (!userId)
    return NextResponse.json(
      { error: 'Bench user not found — run the bench seed first' },
      { status: 503 }
    );

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
  const userId = await getBenchUserId();
  if (!userId)
    return NextResponse.json(
      { error: 'Bench user not found — run the bench seed first' },
      { status: 503 }
    );

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const existing = await prisma.userAction.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.userAction.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
