const energyData = [
    { year: 2018, solar: 120, wind: 80, hydro: 200, geo: 50 },
    { year: 2019, solar: 150, wind: 90, hydro: 210, geo: 55 },
    { year: 2020, solar: 180, wind: 110, hydro: 220, geo: 60 },
    { year: 2021, solar: 210, wind: 130, hydro: 230, geo: 65 },
    { year: 2022, solar: 250, wind: 160, hydro: 240, geo: 70 }
];

const ctxLine = document.getElementById("linechart").getContext("2d");
const ctxbar = document.getElementById("barchart").getContext("2d");

let currentType = "all";

function getChartData(type){
  const labels = energyData.map(d=>d.year);
  let datasets = [];

  const colors = {
    solar: "#FFD700",
    wind: "#00BFFF",
    hydro: "#1E90FF",
    geo: "#FF6347"
  };

  if(type === "all"){
    Object.keys(colors).forEach(key=>{
      datasets.push({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        data: energyData.map(d=>d[key]),
        borderColor: colors[key],
        backgroundColor: colors[key] + "88",
        fill: true
      })
    });
  }
  else{
    datasets.push({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      data: energyData.map(d=>d[type]),
      borderColor: colors[type],
      backgroundColor: colors[type] + "88",
      fill :true
    });
  }

  return {labels, datasets};
};

let linechart = new Chart(ctxLine, {
    type: "line",
    data: getChartData("all"),
    options: {
      responsive: true,
      plugins: {tooltip: {enabled: true}}
    }
  });

  let barchart = new Chart(ctxbar, {
    type: "bar",
    data: getChartData("all"),
    options: {
      responsive: true,
      plugins: {tooltip: {enabled: true}}
    }
  });

  document.querySelectorAll(".controls button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      currentType = btn.getAttribute("data-type");
      linechart.data = getChartData(currentType);
      barchart.data = getChartData(currentType);
      linechart.update();
      barchart.update();
    })
  })
