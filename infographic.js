/* =========================
   DATA SERVICE (ASYNC)
========================= */
function fetchEnergyData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { year: 2018, solar: 120, wind: 80, hydro: 200, geo: 50 },
        { year: 2019, solar: 150, wind: 90, hydro: 210, geo: 55 },
        { year: 2020, solar: 180, wind: 110, hydro: 220, geo: 60 },
        { year: 2021, solar: 210, wind: 130, hydro: 230, geo: 65 },
        { year: 2022, solar: 250, wind: 160, hydro: 240, geo: 70 }
      ]);
    }, 700);
  });
}

/* =========================
   APPLICATION STATE
========================= */
const state = {
  data: [],
  type: "all",       // solar | wind | hydro | geo | all
  metric: "absolute" // absolute | growth
};

/* =========================
   METRICS (DERIVED DATA)
========================= */
function calculateGrowth(data, key) {
  return data.map((item, index) => {
    if (index === 0) return 0;
    const prev = data[index - 1][key];
    return +(((item[key] - prev) / prev) * 100).toFixed(2);
  });
}

/* =========================
   DATA ADAPTER
========================= */
function getChartData(type, metric) {
  const labels = state.data.map(d => d.year);

  const colors = {
    solar: "#FFD700",
    wind: "#00BFFF",
    hydro: "#1E90FF",
    geo: "#FF6347"
  };

  const keys = type === "all" ? Object.keys(colors) : [type];

  const datasets = keys.map(key => ({
    label:
      metric === "growth"
        ? `${key.toUpperCase()} Growth %`
        : key.toUpperCase(),
    data:
      metric === "growth"
        ? calculateGrowth(state.data, key)
        : state.data.map(d => d[key]),
    borderColor: colors[key],
    backgroundColor: colors[key] + "66",
    borderWidth: 2,
    fill: true,
    tension: 0.3
  }));

  return { labels, datasets };
}

/* =========================
   CHART FACTORY
========================= */
const ctxLine = document.getElementById("linechart").getContext("2d");
const ctxBar = document.getElementById("barchart").getContext("2d");

let lineChart = null;
let barChart = null;

function destroyCharts() {
  lineChart?.destroy();
  barChart?.destroy();
}

function renderCharts() {
  destroyCharts();

  const chartData = getChartData(state.type, state.metric);

  lineChart = new Chart(ctxLine, {
    type: "line",
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        tooltip: { enabled: true }
      }
    }
  });

  barChart = new Chart(ctxBar, {
    type: "bar",
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        tooltip: { enabled: true }
      }
    }
  });
}

/* =========================
   EVENT HANDLERS
========================= */
document.querySelectorAll(".controls button").forEach(btn => {
  btn.addEventListener("click", () => {
    state.type = btn.dataset.type;
    renderCharts();
  });
});

/* =========================
   INITIALIZATION
========================= */
async function init() {
  state.data = await fetchEnergyData();
  renderCharts();
}

init();