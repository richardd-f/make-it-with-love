/**
 * Benchmark seed — ADDITIVE and idempotent.
 *
 * Stands up the minimal fixtures the monitoring/benchmark rig needs:
 *   - one USER-role account k6 can authenticate as (hard phase)
 *   - a handful of courses with LOCAL image URLs so the home page (medium phase)
 *     and /courses render real <Image> tags that exercise /_next/image
 *     optimization without any external (Cloudinary) dependency.
 *
 * This does NOT touch the admin account created by prisma/seed.ts. Run it after
 * the normal seed. Safe to run repeatedly.
 *
 * Mirrors prisma/seed.ts exactly (generated client + pg pool adapter) so it runs
 * in the same container the app is built from.
 */
import { PrismaClient } from '../src/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BENCH_EMAIL = 'bench@makeitwithlove.com';
const BENCH_PASSWORD = 'Bench@12345';

// Local assets that already ship in public/images/home/carousel/.
// Using local images keeps the medium phase fully self-contained.
const COURSE_SEED = [
  { name: 'Bench: Pottery Basics', img: '/images/home/carousel/pottery1.webp', minAge: 6, price: 150000 },
  { name: 'Bench: Pottery Glazing', img: '/images/home/carousel/pottery2.webp', minAge: 8, price: 175000 },
  { name: 'Bench: Teapot Sculpting', img: '/images/home/carousel/teapot1.webp', minAge: 8, price: 200000 },
  { name: 'Bench: Watercolor Painting', img: '/images/home/carousel/paint1.webp', minAge: 5, price: 120000 },
  { name: 'Bench: Acrylic Painting', img: '/images/home/carousel/paint2.webp', minAge: 7, price: 130000 },
  { name: 'Bench: Woodworking Intro', img: '/images/home/carousel/wood1.webp', minAge: 9, price: 220000 },
  { name: 'Bench: Wood Carving', img: '/images/home/carousel/wood2.webp', minAge: 10, price: 240000 },
  { name: 'Bench: DTF Printing Fun', img: '/images/home/carousel/dtf2.webp', minAge: 7, price: 110000 },
];

async function main() {
  // 1. Benchmark user (role USER) — used by the k6 hard phase to authenticate.
  const existingUser = await prisma.user.findUnique({ where: { email: BENCH_EMAIL } });
  if (existingUser) {
    console.log(`⚡ Bench user already exists: ${BENCH_EMAIL}`);
  } else {
    const hashedPassword = await bcrypt.hash(BENCH_PASSWORD, 10);
    await prisma.user.create({
      data: { name: 'Benchmark User', email: BENCH_EMAIL, password: hashedPassword, role: 'USER' },
    });
    console.log(`✅ Bench user seeded: ${BENCH_EMAIL} / ${BENCH_PASSWORD}`);
  }

  // 2. Image-bearing courses (idempotent by name).
  let created = 0;
  for (const c of COURSE_SEED) {
    const existing = await prisma.course.findFirst({ where: { name: c.name } });
    if (existing) continue;
    await prisma.course.create({
      data: {
        name: c.name,
        description: 'Seeded course for load benchmarking.',
        imgUrl: c.img,
        minAge: c.minAge,
        price: c.price,
        amountOfMeeting: 4,
      },
    });
    created++;
  }
  console.log(`✅ Bench courses ensured (${created} created, ${COURSE_SEED.length - created} already present).`);
}

main()
  .catch((e) => {
    console.error('❌ Bench seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
