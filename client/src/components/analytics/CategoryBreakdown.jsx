import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './CategoryBreakdown.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryBreakdown = ({ data = [], title = 'Category Breakdown' }) => {
    const chartData = {
        labels: data.map(d => d.category),
        datasets: [
            {
                data: data.map(d => d.count),
                backgroundColor: [
                    'hsl(243, 75%, 59%)',
                    'hsl(160, 84%, 39%)',
                    'hsl(31, 100%, 63%)',
                    'hsl(0, 84%, 60%)',
                    'hsl(280, 75%, 59%)',
                ],
                borderWidth: 2,
                borderColor: 'var(--surface)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
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
    };

    return (
        <div className="category-breakdown">
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default CategoryBreakdown;
