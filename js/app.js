const container = document.getElementById("stocks");

// small universe for now
const SYMBOLS = [
  "PLUG", "SOFI", "MARA", "RIOT", "FUBO",
  "OPEN", "CHPT", "LCID", "BBAI", "NVOS"
];

async function fetchQuotes(symbols) {
  const url =
    "https://query1.finance.yahoo.com/v7/finance/quote?symbols=" +
    symbols.join(",");

  const res = await fetch(url);
  const data = await res.json();
  return data.quoteResponse.result;
}

async function fetchNews(symbol) {
  const rssUrl =
    "https://news.google.com/rss/search?q=" +
    encodeURIComponent(symbol + " stock");

  const proxy =
    "https://api.allorigins.win/raw?url=" + encodeURIComponent(rssUrl);

  const res = await fetch(proxy);
  const text = await res.text();

  const match = text.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i);
  return match ? match[1] : null;
}

async function runScanner() {
  container.innerHTML = "";

  const quotes = await fetchQuotes(SYMBOLS);

  for (const q of quotes) {
    const price = q.regularMarketPrice;
    const changePct = q.regularMarketChangePercent;
    const volume = q.regularMarketVolume;
    const avgVolume = q.averageDailyVolume3Month;

    if (
      price >= 2 &&
      price <= 20 &&
      changePct >= 10 &&
      volume >= avgVolume * 5
    ) {
      const headline = await fetchNews(q.symbol);

      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${q.symbol} — ${q.shortName || ""}</h3>
        <p><strong>Price:</strong> $${price.toFixed(2)}</p>
        <p><strong>Move:</strong> +${changePct.toFixed(2)}%</p>
        <p><strong>Volume:</strong> ${volume.toLocaleString()}
           (avg ${avgVolume.toLocaleString()})</p>
        <p class="news">
          📰 ${headline || "No headline found"}
        </p>
      `;

      container.appendChild(div);
    }
  }

  if (!container.children.length) {
    container.innerHTML = "No qualifying momentum stocks right now.";
  }
}

runScanner();
