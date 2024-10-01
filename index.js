const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  // Page loads and gets titles
  const articles = await page.$$eval('.athing', (rows) => {
    return rows.map(row => {
      const title = row.querySelector('.titleline > a').innerText;
      const link = row.querySelector('.titleline > a').href;
      const rank = row.querySelector('.rank') ? row.querySelector('.rank').innerText : null;
      return { title, link, rank };
    });
  });

  // Slice to get portion of array (first 100)
  const first100 = articles.slice(0, 100);

  // Sort newest to oldest
  const sortedArticles = first100.sort((a, b) => {
    return parseInt(b.rank) - parseInt(a.rank);
  });

  // Output
  console.log("Sorted Articles:");
  sortedArticles.forEach(article => {
    console.log(`${article.rank}: ${article.title} - ${article.link}`);
  });

  // Close the browser
  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
