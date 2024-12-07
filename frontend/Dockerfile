FROM node:20-alpine
WORKDIR /app

# Add debugging tools
RUN apk add --no-cache bash

# Copy package files
COPY package*.json ./

# Install dependencies with verbose logging
RUN npm install --verbose

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build with verbose logging
RUN set -x && \
    echo "Starting build process..." && \
    ls -la && \
    npm run build --verbose

CMD ["npm", "start"] 