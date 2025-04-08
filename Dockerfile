# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy build files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a default index.html if build fails
RUN echo "<!DOCTYPE html><html><head><title>ServiceWatch</title></head><body><h1>ServiceWatch is starting...</h1></body></html>" > /usr/share/nginx/html/index.html.backup \
    && if [ ! -f /usr/share/nginx/html/index.html ]; then cp /usr/share/nginx/html/index.html.backup /usr/share/nginx/html/index.html; fi

# Ensure proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html

# Healthcheck to verify web server is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Start nginx (using exec form for better signal handling)
CMD ["nginx", "-g", "daemon off;"]
