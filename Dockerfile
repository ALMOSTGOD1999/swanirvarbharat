FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN node ace build

# ---- Production image ----
FROM node:20-alpine AS runner

WORKDIR /app

# Copy the full build output
COPY --from=builder /app/build .

# Copy production node_modules
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3333

CMD ["node", "bin/server.js"]
