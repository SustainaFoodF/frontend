import { useEffect, useState } from "react";
import { getData } from "../../../services/helpers";
import Chart from "react-apexcharts";

export default function AnalysisComponent() {
  const [chartData, setChartData] = useState({
    series: [],
    categories: [],
  });
  const fetchData = async () => {
    const response = await getData("http://localhost:5001/stats/commandByShop");
    if (response) {
      const categories = response.map((e) => e.product.label);
      const soldQuantities = response.map((e) => e.totalQuantitySold || 0);
      const availableQuantities = response.map((e) => e.product.quantity || 0);

      setChartData({
        series: [
          {
            name: "Sold",
            data: soldQuantities,
          },
          {
            name: "Available",
            data: availableQuantities,
          },
        ],
        categories,
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div>
        <h2>Product Sales Analysis</h2>
        <Chart
          options={{
            chart: {
              type: "bar",
              stacked: true,
            },
            plotOptions: {
              bar: {
                horizontal: true, // <== Change to horizontal bar chart
              },
            },
            xaxis: {
              categories: chartData.categories,
              title: { text: "Quantity" },
            },
            yaxis: {
              title: { text: "Products" },
            },
            legend: { position: "top" },
            fill: { opacity: 1 },
            dataLabels: { enabled: false },
          }}
          series={chartData.series}
          type="bar"
          height={500}
        />
      </div>
    </>
  );
}
