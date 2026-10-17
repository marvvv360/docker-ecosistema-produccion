# ==========================================
# ETAPA 1: Instalación de Dependencias (deps)
# ==========================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiamos solo los manifiestos de dependencias para aprovechar la caché de Docker
COPY package.json package-lock.json* ./
RUN npm ci

# ==========================================
# ETAPA 2: Compilación del Proyecto (builder)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Deshabilitamos la telemetría de Next.js durante el build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ==========================================
# ETAPA 3: Entorno de Ejecución (runner)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Seguridad: Crear un usuario sin privilegios root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar artefactos estáticos y compilados en modo standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]