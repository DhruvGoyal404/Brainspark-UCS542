import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import './AccuracyTrend.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AccuracyTrend = ({ data = [], title = 'Accuracy Trend (7-Day Average)' }) => {
    // Calculate rolling 7-day average
    const calculateRollingAverage = (dataPoints, windowSize = 7) => {
        const result = [];
        for (let i = 0; i < dataPoints.length; i++) {
            const start = Math.max(0, i - windowSize + 1);
            const window = dataPoints.slice(start, i + 1);
            const average = window.reduce((sum, val) => sum + val, 0) / window.length;
            result.push(Math.round(average * 10) / 10); // Round to 1 decimal
        }
        return result;
    };

    const values = data.map(d => d.value);
    const rollingAverage = calculateRollingAverage(values);

    const chartData = {
        labels: data.map(d => d.label),
        datasets: [
            {
                label: 'Accuracy (%)',
                data: values,
                borderColor: 'hsl(243, 75%, 59%)',
                backgroundColor: 'hsla(243, 75%, 59%, 0.05)',
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 5,
                tension: 0,
            },
            {
                label: '7-Day Average',
                data: rollingAverage,
                borderColor: 'hsl(160, 84%, 39%)',
                backgroundColor: 'hsla(160, 84%, 39%, 0.1)',
                fill: true,
                borderWidth: 3,
                pointRadius: 0,
                pointHoverRadius: 6,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label}: ${context.parsed.y}%`;
                    },
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
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="accuracy-trend">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default AccuracyTrend;
