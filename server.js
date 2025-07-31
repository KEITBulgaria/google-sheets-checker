const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/scrape', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const content = await page.content();
    let status = 'ЗА ПРОВЕРКА';
    const text = content.toLowerCase();

    if (text.includes('на склад') || text.includes('наличен') || text.includes('в наличност')) {
      status = 'НАЛИЧЕН';
    } else if (text.includes('изчерпан') || text.includes('няма наличност')) {
      status = 'ИЗЧЕРПАН';
    }

    await browser.close();
    res.json({ status });
  } catch (error) {
    res.json({ status: 'ЗА ПРОВЕРКА', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
