const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function scrape(url) {
  try {
    if (!url) {
      throw new Error('URL is required as command-line argument');
    }

    console.log('Scraping URL:', url);
    
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});
    
    // Extract more comprehensive data
    const data = {
      title: await page.title(),
      headings: {
        h1: await page.$$eval('h1', elements => elements.map(el => el.textContent.trim())),
        h2: await page.$$eval('h2', elements => elements.map(el => el.textContent.trim())),
        h3: await page.$$eval('h3', elements => elements.map(el => el.textContent.trim()))
      },
      metaDescription: await page.$eval('meta[name="description"]', el => el.content).catch(() => 'Not found'),
      firstParagraph: await page.$eval('p', el => el.textContent.trim()).catch(() => 'No paragraph found'),
      paragraphs: await page.$$eval('p', elements => elements.map(el => el.textContent.trim())).catch(() => []),
      links: await page.$$eval('a', links => links.map(link => ({
        text: link.textContent.trim(),
        href: link.href
      }))).catch(() => []),
      images: await page.$$eval('img', images => images.map(img => ({
        src: img.src,
        alt: img.alt
      }))).catch(() => []),
      timestamp: new Date().toISOString(),
      url: url
    };

    fs.writeFileSync('scraped_data.json', JSON.stringify(data, null, 2));
    console.log('Scraping completed successfully');
    await browser.close();
  } catch (error) {
    console.error('Scraping error:', error);
    const errorData = {
      error: 'Scraping failed',
      message: error.message,
      timestamp: new Date().toISOString()
    };
    fs.writeFileSync('scraped_data.json', JSON.stringify(errorData, null, 2));
  }
}

const url = process.argv[2];
scrape(url);