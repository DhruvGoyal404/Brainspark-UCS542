import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import './PerformanceChart.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const PerformanceChart = ({ data = [], title = 'Performance Over Time' }) => {
    const chartData = {
        labels: data.map(d => d.label),
        datasets: [
            {
                label: 'Score (%)',
                data: data.map(d => d.value),
                borderColor: 'hsl(243, 75%, 59%)',
                backgroundColor: 'hsla(243, 75%, 59%, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
        },
        scales: {
            y: {
                min: 0,
                max: 100,
                ticks: {
                    callback: (value) => `${value}%`,
                },
            },
        },
    };

    return (
        <div className="performance-chart">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default PerformanceChart;
