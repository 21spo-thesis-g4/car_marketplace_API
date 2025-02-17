# ===============================
# STAGE 1: Build dependencies
# ===============================
FROM node:18-slim AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# ===============================
# STAGE 2: Final image
# ===============================
FROM node:18-slim

WORKDIR /app

# Copy dependencies from the previous stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy the application source code
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose port 4000
EXPOSE 4000

# Start the application
CMD ["node", "server.js"]
