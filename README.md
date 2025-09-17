# DevOps Assignment: Web Scraper & Server

A Dockerized application that scrapes a URL during build time and serves the content via a Flask server.

## Features

- **Scraping Engine:** Uses Puppeteer on Node.js to scrape titles and headings from a provided URL during build.
- **Web Server:** Lightweight Flask server (Python) to host the scraped data as JSON.
- **Multi-Stage Build:** Optimized Dockerfile ensuring a minimal final image size.
- **Build-Time Configuration:** URL to scrape is provided as a build argument.

## Project Structure
```
devops-assignment/
├── Dockerfile
├── scrape.js
├── server.py
├── package.json
├── requirements.txt
└── README.md
```


## Prerequisites

- Docker installed on your system.

## Build and Run Instructions

### 1. Build the Docker Image

Replace `https://example.com` with the URL you want to scrape.

```bash
docker build -t devops-assignment --build-arg SCRAPE_URL="https://example.com" .
```

### 2. Run the Container
```bash
docker run -p 5000:5000 devops-assignment
```

### 3. Access the Scraped Data
Open your web browser and navigate to:

```URL
http://localhost:5000
```

The scraped data will be displayed in JSON format.

### How It Works
1. Build Stage: Uses a Node.js image to install Chromium and Puppeteer. The `scrape.js` script runs during build to extract the page title and first heading from the provided URL, saving the result to a JSON file.

2. Final Stage: Uses a Python image to copy the JSON file and run a Flask server. The server reads the file and serves its contents as a JSON response.

### Files
- `Dockerfile`: Multi-stage build definition.

- `scrape.js`: Puppeteer script for scraping.

- `server.py`: Flask application to serve data.

- `package.json`: Node.js dependencies.

- `requirements.txt`: Python dependencies.

---

#### 👨‍💻 Developed by **[Paras Saxena](https://saxenaparas.vercel.app/)**
