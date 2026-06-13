FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Unset NODE_ENV so devDependencies are installed for the build
RUN NODE_ENV=development npm ci --legacy-peer-deps

COPY . .

RUN node ace build

# ---- Production image ----
FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/build .
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3333

CMD ["node", "bin/server.js"]
