# ===============================
# STAGE 1: Build dependencies
# ===============================
FROM node:18-slim AS builder

WORKDIR /app

# Kopioi package.json ja package-lock.json
COPY package*.json ./

# Asenna vain tuotantoriippuvuudet
RUN npm ci --only=production

# ===============================
# STAGE 2: Final image
# ===============================
FROM node:18-slim

WORKDIR /app

# Kopioi asennetut moduulit
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Kopioi sovelluksen lähdekoodi
COPY . .

# Aseta ympäristömuuttujat (.env ei lataudu automaattisesti)
ENV NODE_ENV=production

# Expose portti
EXPOSE 4000

# Määritä käynnistyskomento
ENTRYPOINT ["node", "server.js"]
