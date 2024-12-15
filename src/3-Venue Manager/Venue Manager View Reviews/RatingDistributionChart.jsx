import { useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, BarElement, Tooltip, Legend } from 'chart.js';

Chart.register(LinearScale, CategoryScale, BarElement, Tooltip, Legend);

const RatingDistributionChart = ({ reviews }) => {
  const chartRef = useRef(null);

  // Define your data and options for the chart
  const data = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [{
      label: 'Number of Ratings',
      data: [
        reviews.filter(review => review.rating === 1).length,
        reviews.filter(review => review.rating === 2).length,
        reviews.filter(review => review.rating === 3).length,
        reviews.filter(review => review.rating === 4).length,
        reviews.filter(review => review.rating === 5).length,
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const options = {
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Cleanup chart instance on component unmount to prevent reuse error
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return <Bar ref={chartRef} data={data} options={options} />;
};

export default RatingDistributionChart;
