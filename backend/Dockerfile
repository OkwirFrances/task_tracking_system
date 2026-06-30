# FROM node:18-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci --only=production

# COPY . .

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nodejs -u 1001
# USER nodejs

# EXPOSE 5000

# CMD ["node", "src/index.js"]
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install instead of npm ci)
RUN npm install --production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 5000

CMD ["node", "src/index.js"]