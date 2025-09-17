# Build stage
FROM node:18-slim AS scraper

# Install Chromium and dependencies
RUN apt-get update && \
    apt-get install -y chromium fonts-freefont-ttf && \
    rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app
COPY package.json .
RUN npm install
COPY scrape.js .

# Add build argument for URL
ARG SCRAPE_URL
# Run the scraper during build
RUN node scrape.js ${SCRAPE_URL}

# Final stage
FROM python:3.10-slim
WORKDIR /app
COPY --from=scraper /app/scraped_data.json .
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY server.py .

EXPOSE 5000
CMD ["python", "server.py"]