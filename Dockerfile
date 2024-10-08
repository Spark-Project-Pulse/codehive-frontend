# Stage 1: Build
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy only package files to leverage caching
COPY package.json package-lock.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy the rest of the application code
COPY . .

# Set ARG to differentiate between environments, npm run build is only capable of reading .env.production and .env.local,
# so put .env.development in docker-compose.yml as a build argument when you run docker locally
ARG ENV_FILE=".env.production"

# Copy the environment file - if docker compose is used, this will be run with the .env.development file
RUN cp ${ENV_FILE} .env.production

# Build the Next.js app
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app ./

# Expose the port that the app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
