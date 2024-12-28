FROM node:23-slim

# Install Chrome dependencies
RUN apt-get update \
    && apt-get install -y curl gnupg \
    && apt-get install -y chromium fonts-freefont-ttf  \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Set Chrome binary path
ENV CHROME_BIN=/usr/bin/chromium

# Expose port
EXPOSE 3000

USER nobody
# Start the application
CMD ["/app/node_modules/.bin/ts-node", "src/index.ts"]
