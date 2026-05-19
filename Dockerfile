# -------- Stage 1: Build --------
FROM node:20-slim AS builder
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm i --frozen-lockfile

COPY . .

ARG CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_UPLOAD_PRESET
ARG CLOUDINARY_API_KEY

ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
ENV NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=$CLOUDINARY_UPLOAD_PRESET
ENV NEXT_PUBLIC_CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY

# Environment variables for build
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/dummydb"
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm prisma generate
RUN pnpm build
RUN ls -la .next && ls -la .next/standalone

# Prisma 7 generates a hash-based runtime package (e.g. @prisma/client-<hash>) in
# node_modules during `prisma generate`. Next.js standalone file-tracing does not
# capture it because it isn't a declared npm dependency. Copy the whole @prisma
# scope (following pnpm symlinks with -L) so the package is present at runtime.
# RUN cp -rL /app/node_modules/@prisma /app/.next/standalone/node_modules/

# -------- Stage 2: Runtime --------
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:/app/node_modules/.bin:$PATH"

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy only what standalone needs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Prisma schema and config (for migration and seeder)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
# Generated TypeScript client is needed by the seeder (prisma/seed.ts imports from it)
COPY --from=builder /app/src/generated ./src/generated

# Install CLI tools for migration and seeder.
# @prisma/client runtime is already present in node_modules (copied from builder above);
# we re-declare it here so pnpm resolves its peer deps and keeps it consistent.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm add prisma@7.2.0 tsx dotenv @prisma/client@7.2.0 @prisma/adapter-pg pg \
    && pnpm prisma generate

EXPOSE 3000

CMD ["node" , "server.js"]