# Use the official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy all project files to the container, excluding unnecessary files specified in .dockerignore
COPY . .

# Expose port 4000
EXPOSE 4000

# Run the application and handle graceful shutdowns
CMD ["sh", "-c", "trap 'exit' SIGTERM; node server.js"]
