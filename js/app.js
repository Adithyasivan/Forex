const chartContainer = document.getElementById("chart");
const pairSelect = document.getElementById("pairSelect");

// ✅ Official Twelve Data demo key (safe to commit)
const API_KEY = "demo";

/* -----------------------------
   CREATE CHART
----------------------------- */

const chart = LightweightCharts.createChart(chartContainer, {
  width: chartContainer.clientWidth,
  height: 360,
  layout: {
    backgroundColor: "#020617",
    textColor: "#e5e7eb",
  },
  grid: {
    vertLines: { color: "#1e293b" },
    horzLines: { color: "#1e293b" },
  },
  rightPriceScale: {
    borderColor: "#334155",
  },
  timeScale: {
    borderColor: "#334155",
  },
});

const candleSeries = chart.addCandlestickSeries({
  upColor: "#22c55e",
  downColor: "#ef4444",
  borderUpColor: "#22c55e",
  borderDownColor: "#ef4444",
  wickUpColor: "#22c55e",
  wickDownColor: "#ef4444",
});

/* -----------------------------
   LOAD LIVE FOREX DATA
----------------------------- */

async function loadLiveData(pair) {
  const symbol = pair.replace("/", "");

  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1h&outputsize=100&apikey=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.values) {
    console.error("API error:", data);
    return;
  }

  const candles = data.values
    .map(v => ({
      time: v.datetime.split(" ")[0],
      open: parseFloat(v.open),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
      close: parseFloat(v.close),
    }))
    .reverse(); // newest → oldest

  candleSeries.setData(candles);
}

/* -----------------------------
   INITIAL LOAD
----------------------------- */

loadLiveData(pairSelect.value);

/* -----------------------------
   PAIR CHANGE HANDLER
----------------------------- */

pairSelect.addEventListener("change", e => {
  loadLiveData(e.target.value);
});

/* -----------------------------
   RESIZE HANDLER
----------------------------- */

window.addEventListener("resize", () => {
  chart.applyOptions({ width: chartContainer.clientWidth });
});
