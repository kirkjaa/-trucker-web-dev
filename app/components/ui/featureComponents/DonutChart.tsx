import { FC } from "react";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { ChartOptions } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register only what’s needed
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface DonutChartProps {
  data: number[];
  //   labels: string[];
  colors?: string[];
  sumVal?: number;
  unit?: string;
}

const chartColors = [
  "hsla(162, 100%, 38%, 1)",
  "hsla(42, 100%, 50%, 1)",
  "hsla(1, 100%, 67%, 1)",
];

const DonutChart: FC<DonutChartProps> = ({
  data,
  //   labels,
  colors,
  sumVal,
  unit,
}) => {
  const chartData = {
    // labels,
    datasets: [
      {
        data,
        backgroundColor: colors || chartColors,
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    cutout: "70%", // donut thickness
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        // position: "right" as const,
        // labels: {
        //   usePointStyle: true,
        //   pointStyle: "circle",
        //   padding: 16,
        //   color: "#FFFFFF",
        //   font: {
        //     size: 10,
        //   },
        // },
        display: false,
      },
      datalabels: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Chart */}
      <Doughnut
        data={chartData}
        options={options}
        width="120px"
        height="120px"
      />

      {/* Center summary value */}
      {sumVal !== undefined && unit !== undefined && (
        <div className="absolute top-9 flex flex-col items-center pointer-events-none">
          <p className="text-3xl font-bold leading-none">{sumVal}</p>
          <p className="font-semibold leading-none">{unit}</p>
        </div>
      )}
    </div>
  );
};

export default DonutChart;
