const chartContainer = document.getElementById("chart");

const chart = LightweightCharts.createChart(chartContainer, {
  width: chartContainer.clientWidth,
  height: 360,
  layout: {
    background: { color: "#020617" },
    textColor: "#e5e7eb",
  },
});

const candles = chart.addCandlestickSeries();

candles.setData([
  { time: "2024-01-01", open: 1.1, high: 1.12, low: 1.09, close: 1.11 },
  { time: "2024-01-02", open: 1.11, high: 1.13, low: 1.10, close: 1.12 },
  { time: "2024-01-03", open: 1.12, high: 1.14, low: 1.11, close: 1.13 },
]);
