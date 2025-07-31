const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/scrape', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const bodyText = $('body').text().toLowerCase();

    let status = 'ЗА ПРОВЕРКА';
    if (bodyText.includes('на склад') || bodyText.includes('наличен') || bodyText.includes('в наличност')) {
      status = 'НАЛИЧЕН';
    } else if (bodyText.includes('изчерпан') || bodyText.includes('няма наличност') || bodyText.includes('продуктът не е в наличност')) {
      status = 'ИЗЧЕРПАН';
    }

    res.json({ status });
  } catch (error) {
    res.json({ status: 'ЗА ПРОВЕРКА', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
