# --- Stage 1: Base Image ---
# Using the slim variant of Bun 1.3.4 to keep the final size small
FROM oven/bun:1.3.4-slim AS base
WORKDIR /app

# --- Stage 2: Dependencies Stage ---
FROM base AS dependencies
# Copy package files first to maximize Docker layer caching
COPY package.json bun.lock ./
COPY prisma ./prisma
# Install only production dependencies
RUN bun install --frozen-lockfile --production

# --- Stage 3: Final Production Release Image ---
FROM base AS release
# Copy production node_modules from the dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
# Copy your source folder and files
COPY src ./src
COPY package.json ./

# Set environment to production
ENV NODE_ENV=production

# Security best practice: Run as the built-in non-root 'bun' user
USER bun

# Change this to whichever port your index.js listens on
EXPOSE 3000

# Run the app
ENTRYPOINT [ "bun", "run", "src/index.js" ]