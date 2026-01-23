const container = document.getElementById("stocks");
const status = document.getElementById("status");
const scanBtn = document.getElementById("scanBtn");

const SYMBOLS = [
  "PLUG", "SOFI", "MARA", "RIOT", "FUBO",
  "OPEN", "CHPT", "LCID", "BBAI", "NVOS"
];

async function fetchQuotes(symbols) {
  const url =
    "https://query1.finance.yahoo.com/v7/finance/quote?symbols=" +
    symbols.join(",");

  const res = await fetch(url);
  if (!res.ok) throw new Error("Yahoo request failed");

  const data = await res.json();
  return data.quoteResponse.result;
}

async function fetchNews(symbol) {
  const rss =
    "https://news.google.com/rss/search?q=" +
    encodeURIComponent(symbol + " stock");

  const proxy =
    "https://api.allorigins.win/raw?url=" + encodeURIComponent(rss);

  const res = await fetch(proxy);
  if (!res.ok) return null;

  const text = await res.text();
  const match = text.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i);
  return match ? match[1] : null;
}

async function runScanner() {
  container.innerHTML = "";
  status.textContent = "Scanning market…";

  try {
    const quotes = await fetchQuotes(SYMBOLS);
    let found = 0;

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
        found++;
        const headline = await fetchNews(q.symbol);

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
          <h3>${q.symbol} — ${q.shortName || ""}</h3>
          <p><strong>Price:</strong> $${price.toFixed(2)}</p>
          <p><strong>Move:</strong> +${changePct.toFixed(2)}%</p>
          <p><strong>Volume:</strong> ${volume.toLocaleString()}
             (avg ${avgVolume.toLocaleString()})</p>
          <p class="news">📰 ${headline || "No headline found"}</p>
        `;

        container.appendChild(div);
      }
    }

    status.textContent =
      found > 0
        ? `Found ${found} momentum stocks`
        : "No stocks matched criteria";

  } catch (err) {
    status.textContent = "Scanner failed (API blocked or rate limited)";
    console.error(err);
  }
}

scanBtn.addEventListener("click", runScanner);
