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

# Inject Next.js env variables here
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

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
