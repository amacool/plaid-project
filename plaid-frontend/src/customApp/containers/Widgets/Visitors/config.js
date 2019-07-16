/* * * * * * * * * * * * * * * * * * * *
              Charts Config
* * * * * * * * * * * * * * * * * * * */
const options = {
  responsive: true,
  type: "bar",
  legend: {
    display: false
  },
  tooltips: {
    mode: "label"
  },
  elements: {
    line: {
      fill: false
    }
  },
  scales: {
    yAxes: [
      {
        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
        display: true,
        position: "left",
        id: "y-axis-1"
      },
      {
        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
        display: false,
        position: "right",
        id: "y-axis-2",
        gridLines: {
          drawOnChartArea: false
        }
      }
    ]
  }
};

const plugins = [
  {
    afterDraw: (chartInstance, easing) => {
      const ctx = chartInstance.chart.ctx;
      ctx.fillText("", 100, 100);
    }
  }
];
export { options, plugins };
