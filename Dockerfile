# ---- Base: Use official Bun image ----
  FROM oven/bun:slim

  # Environment variables to avoid Puppeteer downloading Chromium
  ENV PUPPETEER_SKIP_DOWNLOAD=true
  ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"
  
  # Install Chromium + dependencies for Puppeteer
  RUN apt-get update && apt-get install -y \
      chromium \
      ca-certificates \
      fonts-liberation \
      libappindicator3-1 \
      libasound2 \
      libatk-bridge2.0-0 \
      libatk1.0-0 \
      libcups2 \
      libdbus-1-3 \
      libdrm2 \
      libgbm1 \
      libnspr4 \
      libnss3 \
      libx11-xcb1 \
      libxcomposite1 \
      libxdamage1 \
      libxrandr2 \
      xdg-utils \
      --no-install-recommends && \
      apt-get clean && \
      rm -rf /var/lib/apt/lists/*
  
  # Create app directory
  WORKDIR /app
  
  # Copy everything
  COPY . .
  
  # Install dependencies
  RUN bun install
  
  # Define command
  CMD ["bun", "run", "start"]
  