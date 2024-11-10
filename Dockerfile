# Use the official Bun image
FROM oven/bun:1

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package.json bun.lockb ./
COPY packages/server/package.json ./packages/server/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY packages/server/ packages/server

# Set the entrypoint to run pkg-a
CMD ["bun", "run", "packages/server/src/main.ts"]
