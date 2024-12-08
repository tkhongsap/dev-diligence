FROM node:20-alpine
WORKDIR /app

# Add debugging tools
RUN apk add --no-cache bash curl

# Copy package files
COPY package*.json ./

# Install dependencies with verbose logging
RUN npm install --verbose

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080

# Build with verbose logging
RUN set -x && \
    echo "Starting build process..." && \
    ls -la && \
    npm run build --verbose

# Expose the port
EXPOSE 8080

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

CMD ["npm", "start"] 