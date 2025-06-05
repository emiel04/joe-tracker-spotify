# ---- Base: Use official Bun image ----
  FROM oven/bun:slim as base

  # Install dependencies required for Puppeteer (Chromium)
  RUN apt-get update && apt-get install -y \
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
      wget \
      --no-install-recommends && \
      apt-get clean && \
      rm -rf /var/lib/apt/lists/*
  
  # Create app directory
  WORKDIR /app
  
  # Copy app files
  COPY . .
  
  # Install Bun deps
  RUN bun install
  
  # Puppeteer will download Chromium the first time it runs
  ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
  
  # Expose port if you add a web server (optional)
  # EXPOSE 3000
  
  # Run the script (change entrypoint if needed)
  CMD ["bun", "run", "start"]
  