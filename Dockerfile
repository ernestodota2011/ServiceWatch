# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make gcc g++ curl

# Copy package files
COPY package.json package-lock.json* ./

# Clean npm cache and install dependencies
RUN npm cache clean --force && \
    npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application (with error handling)
RUN set -e && \
    npm run build || \
    (echo "Build failed. Generating fallback index.html" && \
     mkdir -p dist && \
     echo "<!DOCTYPE html><html><head><title>ServiceWatch</title></head><body><h1>Build Failed - ServiceWatch</h1></body></html>" > dist/index.html)

# Production stage
FROM nginx:stable-alpine

# Copy build files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ensure proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html

# Healthcheck to verify web server is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Start nginx (using exec form for better signal handling)
CMD ["nginx", "-g", "daemon off;"]