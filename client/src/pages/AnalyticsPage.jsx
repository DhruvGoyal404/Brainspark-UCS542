import { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { TrendingUp, Target, Award, Calendar, Filter, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './AnalyticsPage.css';

// Import Chart.js components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AnalyticsPage = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [timeRange, setTimeRange] = useState('30d');

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const isDark = theme === 'dark';

    // Mock data for charts
    const performanceData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [
            {
                label: 'Average Score',
                data: [65, 72, 78, 75, 82, 85],
                borderColor: 'hsl(243, 75%, 59%)',
                backgroundColor: 'hsla(243, 75%, 59%, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const categoryData = {
        labels: ['DSA', 'Operating Systems', 'DBMS', 'Networks', 'Others'],
        datasets: [
            {
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    'hsl(243, 75%, 59%)',
                    'hsl(160, 84%, 39%)',
                    'hsl(31, 100%, 63%)',
                    'hsl(199, 89%, 48%)',
                    'hsl(0, 84%, 60%)'
                ],
                borderWidth: 0
            }
        ]
    };

    const accuracyData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Accuracy %',
                data: [78, 82, 85, 80, 88, 92, 87],
                backgroundColor: 'hsl(160, 84%, 39%)',
                borderRadius: 8
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: isDark ? 'hsl(0, 0%, 95%)' : 'hsl(222, 47%, 11%)',
                    padding: 15,
                    font: {
                        size: 12,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: isDark ? 'hsl(217, 33%, 17%)' : 'hsl(0, 0%, 100%)',
                titleColor: isDark ? 'hsl(0, 0%, 95%)' : 'hsl(222, 47%, 11%)',
                bodyColor: isDark ? 'hsl(214, 15%, 70%)' : 'hsl(215, 14%, 34%)',
                borderColor: isDark ? 'hsl(217, 33%, 25%)' : 'hsl(214, 15%, 85%)',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                boxPadding: 6
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: isDark ? 'hsla(217, 33%, 25%, 0.5)' : 'hsla(214, 15%, 85%, 0.5)'
                },
                ticks: {
                    color: isDark ? 'hsl(214, 15%, 70%)' : 'hsl(215, 14%, 34%)'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: isDark ? 'hsl(214, 15%, 70%)' : 'hsl(215, 14%, 34%)'
                }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: isDark ? 'hsl(0, 0%, 95%)' : 'hsl(222, 47%, 11%)',
                    padding: 15,
                    font: {
                        size: 12,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: isDark ? 'hsl(217, 33%, 17%)' : 'hsl(0, 0%, 100%)',
                titleColor: isDark ? 'hsl(0, 0%, 95%)' : 'hsl(222, 47%, 11%)',
                bodyColor: isDark ? 'hsl(214, 15%, 70%)' : 'hsl(215, 14%, 34%)',
                borderColor: isDark ? 'hsl(217, 33%, 25%)' : 'hsl(214, 15%, 85%)',
                borderWidth: 1
            }
        }
    };

    const stats = [
        {
            label: 'Average Score',
            value: '82%',
            change: '+5%',
            trend: 'up',
            icon: <TrendingUp size={24} />
        },
        {
            label: 'Total Quizzes',
            value: user?.stats?.totalQuizzes || 0,
            change: '+3',
            trend: 'up',
            icon: <Target size={24} />
        },
        {
            label: 'Success Rate',
            value: '78%',
            change: '+2%',
            trend: 'up',
            icon: <Award size={24} />
        },
        {
            label: 'Study Streak',
            value: `${user?.stats?.currentStreak || 0} days`,
            change: 'Active',
            trend: 'neutral',
            icon: <Calendar size={24} />
        }
    ];

    return (
        <div className="analytics-page">
            <div className="analytics-container container">
                {/* Header */}
                <Motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="analytics-header"
                >
                    <div className="header-content">
                        <h1 className="page-title">Analytics Dashboard</h1>
                        <p className="page-subtitle">Track your learning progress and insights</p>
                    </div>

                    <div className="time-range-selector">
                        <Filter size={20} />
                        {['7d', '30d', '90d', 'all'].map((range) => (
                            <Button
                                key={range}
                                variant={timeRange === range ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setTimeRange(range)}
                            >
                                {range === 'all' ? 'All Time' : range.toUpperCase()}
                            </Button>
                        ))}
                    </div>
                </Motion.div>

                {/* Stats Cards */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="stats-grid"
                >
                    {stats.map((stat, index) => (
                        <Card key={index} className="stat-card" hoverable>
                            <div className="stat-icon-wrapper">
                                {stat.icon}
                            </div>
                            <div className="stat-info">
                                <div className="stat-label">{stat.label}</div>
                                <div className="stat-value">{stat.value}</div>
                                <div className={`stat-change ${stat.trend}`}>
                                    {stat.change}
                                </div>
                            </div>
                        </Card>
                    ))}
                </Motion.div>

                {/* Charts Grid */}
                <div className="charts-section">
                    {/* Download Report Button */}
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="download-report-section"
                    >
                        <Button variant="secondary" onClick={() => alert('Report download feature coming soon!')}>
                            <Download size={18} />
                            Download Your Report
                        </Button>
                    </Motion.div>

                    {/* Performance Over Time */}
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="chart-card">
                            <div className="chart-header">
                                <h2 className="chart-title">Performance Over Time</h2>
                                <p className="chart-subtitle">Your score trends over the weeks</p>
                            </div>
                            <div className="chart-wrapper">
                                <Line data={performanceData} options={chartOptions} />
                            </div>
                        </Card>
                    </Motion.div>

                    {/* Category Breakdown & Accuracy */}
                    <div className="charts-row">
                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card className="chart-card">
                                <div className="chart-header">
                                    <h2 className="chart-title">Category Breakdown</h2>
                                    <p className="chart-subtitle">Quiz distribution by subject</p>
                                </div>
                                <div className="chart-wrapper chart-small">
                                    <Doughnut data={categoryData} options={doughnutOptions} />
                                </div>
                            </Card>
                        </Motion.div>

                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Card className="chart-card">
                                <div className="chart-header">
                                    <h2 className="chart-title">Weekly Accuracy</h2>
                                    <p className="chart-subtitle">Daily performance this week</p>
                                </div>
                                <div className="chart-wrapper chart-small">
                                    <Bar data={accuracyData} options={chartOptions} />
                                </div>
                            </Card>
                        </Motion.div>
                    </div>
                </div>

                {/* Insights */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <Card className="insights-card">
                        <h2 className="section-title">Key Insights</h2>
                        <div className="insights-grid">
                            <div className="insight-item">
                                <div className="insight-icon success">📈</div>
                                <div className="insight-content">
                                    <h3 className="insight-title">Improving Trend</h3>
                                    <p className="insight-text">
                                        Your scores have increased by 20% over the last month. Keep it up!
                                    </p>
                                </div>
                            </div>

                            <div className="insight-item">
                                <div className="insight-icon warning">🎯</div>
                                <div className="insight-content">
                                    <h3 className="insight-title">Focus Area</h3>
                                    <p className="insight-text">
                                        Operating Systems needs more practice. Try taking more OS quizzes.
                                    </p>
                                </div>
                            </div>

                            <div className="insight-item">
                                <div className="insight-icon info">⭐</div>
                                <div className="insight-content">
                                    <h3 className="insight-title">Strength</h3>
                                    <p className="insight-text">
                                        You excel at DSA! Your accuracy in this category is 92%.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Motion.div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
