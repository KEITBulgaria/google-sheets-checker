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
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    const $ = cheerio.load(data);
    const text = $('body').text().toLowerCase();

    let status = 'ЗА ПРОВЕРКА';
    if (text.includes('на склад') || text.includes('в наличност')) {
      status = 'НАЛИЧЕН';
    } else if (text.includes('изчерпан') || text.includes('няма наличност')) {
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
