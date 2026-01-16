const chartContainer = document.getElementById("chart");

const chart = LightweightCharts.createChart(chartContainer, {
  width: chartContainer.clientWidth,
  height: 360,
  layout: {
    background: { color: "#020617" },
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

// ✅ v5 API
const candleSeries = chart.addSeries(
  LightweightCharts.CandlestickSeries,
  {
    upColor: "#22c55e",
    downColor: "#ef4444",
    borderUpColor: "#22c55e",
    borderDownColor: "#ef4444",
    wickUpColor: "#22c55e",
    wickDownColor: "#ef4444",
  }
);

candleSeries.setData([
  { time: "2024-01-01", open: 1.090, high: 1.095, low: 1.088, close: 1.092 },
  { time: "2024-01-02", open: 1.092, high: 1.098, low: 1.090, close: 1.097 },
  { time: "2024-01-03", open: 1.097, high: 1.100, low: 1.094, close: 1.095 },
  { time: "2024-01-04", open: 1.095, high: 1.099, low: 1.091, close: 1.092 },
  { time: "2024-01-05", open: 1.092, high: 1.096, low: 1.089, close: 1.094 },
]);

window.addEventListener("resize", () => {
  chart.applyOptions({ width: chartContainer.clientWidth });
});
