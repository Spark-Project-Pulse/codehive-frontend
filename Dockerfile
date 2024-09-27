# Stage 1: Build
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only the build artifacts and necessary files from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY package.json ./

# Set NODE_ENV to production
ENV NODE_ENV=production

# Install production dependencies
RUN npm install --production

# Expose the port that the app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
