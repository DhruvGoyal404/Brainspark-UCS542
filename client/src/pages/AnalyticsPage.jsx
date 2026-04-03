import { useState, useEffect, useMemo } from 'react';
import { motion as Motion } from 'framer-motion';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { TrendingUp, Target, Award, Calendar, Filter, BarChart3, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../utils/api';
import './AnalyticsPage.css';

import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement, BarElement,
    ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, BarElement,
    ArcElement, Title, Tooltip, Legend, Filler
);

const CATEGORY_COLORS = {
    dsa: 'hsl(243, 75%, 59%)',
    'operating-systems': 'hsl(160, 84%, 39%)',
    dbms: 'hsl(31, 100%, 63%)',
    networks: 'hsl(199, 89%, 48%)',
    other: 'hsl(280, 75%, 55%)'
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AnalyticsPage = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [timeRange, setTimeRange] = useState('30d');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/user/stats');
            setStats(res.data.data);
        } catch (err) {
            setError('Failed to load analytics data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    const isDark = theme === 'dark';

    // ── Filter recent results by time range ──
    const filteredResults = useMemo(() => {
        if (!stats?.recentResults) return [];
        const now = new Date();
        const cutoff = { '7d': 7, '30d': 30, '90d': 90, 'all': 99999 }[timeRange] || 30;
        return stats.recentResults.filter(r => {
            const days = (now - new Date(r.createdAt)) / (1000 * 60 * 60 * 24);
            return days <= cutoff;
        });
    }, [stats, timeRange]);

    // ── Performance over time: group by week ──
    const performanceData = useMemo(() => {
        if (!filteredResults.length) return null;
        const sorted = [...filteredResults].reverse();
        const weekMap = {};
        sorted.forEach(r => {
            const d = new Date(r.createdAt);
            const weekNum = `${d.getFullYear()}-W${String(Math.ceil((d.getDate() + new Date(d.getFullYear(), d.getMonth(), 1).getDay()) / 7)).padStart(2, '0')}`;
            if (!weekMap[weekNum]) weekMap[weekNum] = [];
            weekMap[weekNum].push(r.percentage);
        });
        const weeks = Object.keys(weekMap).slice(-8);
        return {
            labels: weeks.map((w, i) => i === weeks.length - 1 ? 'This Week' : `Week ${i + 1}`),
            datasets: [{
                label: 'Average Score',
                data: weeks.map(w => {
                    const arr = weekMap[w];
                    return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
                }),
                borderColor: 'hsl(243, 75%, 59%)',
                backgroundColor: 'hsla(243, 75%, 59%, 0.1)',
                fill: true, tension: 0.4, pointRadius: 5
            }]
        };
    }, [filteredResults]);

    // ── Category breakdown (doughnut) ──
    const categoryData = useMemo(() => {
        if (!filteredResults.length) return null;
        const catCount = {};
        filteredResults.forEach(r => {
            catCount[r.category] = (catCount[r.category] || 0) + 1;
        });
        const cats = Object.keys(catCount);
        return {
            labels: cats.map(c => c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
            datasets: [{
                data: cats.map(c => catCount[c]),
                backgroundColor: cats.map(c => CATEGORY_COLORS[c] || 'hsl(280,75%,55%)'),
                borderWidth: 0
            }]
        };
    }, [filteredResults]);

    // ── Daily accuracy (bar) — day of week average ──
    const accuracyData = useMemo(() => {
        if (!filteredResults.length) return null;
        const dayBuckets = Array.from({ length: 7 }, () => []);
        filteredResults.forEach(r => {
            const dow = new Date(r.createdAt).getDay();
            dayBuckets[dow].push(r.percentage);
        });
        return {
            labels: DAYS,
            datasets: [{
                label: 'Avg Score %',
                data: dayBuckets.map(arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0),
                backgroundColor: 'hsl(160, 84%, 39%)',
                borderRadius: 8
            }]
        };
    }, [filteredResults]);

    // ── Dynamic insight cards ──
    const insights = useMemo(() => {
        if (!stats) return [];
        const { categoryStats, recentResults } = stats;
        const out = [];

        if (categoryStats?.length) {
            const best = [...categoryStats].sort((a, b) => b.avgScore - a.avgScore)[0];
            const worst = [...categoryStats].sort((a, b) => a.avgScore - b.avgScore)[0];
            if (best) out.push({ icon: '⭐', type: 'success', title: `Strongest: ${best.category.toUpperCase()}`, text: `Avg score: ${best.avgScore}% across ${best.count} quizzes.` });
            if (worst && worst.category !== best?.category) out.push({ icon: '🎯', type: 'warning', title: `Focus Area: ${worst.category.replace(/-/g, ' ').toUpperCase()}`, text: `Avg score: ${worst.avgScore}%. More practice will help!` });
        }

        if (recentResults?.length >= 2) {
            const recent = recentResults.slice(0, 5);
            const older = recentResults.slice(5, 10);
            if (older.length) {
                const recentAvg = recent.reduce((a, b) => a + b.percentage, 0) / recent.length;
                const olderAvg = older.reduce((a, b) => a + b.percentage, 0) / older.length;
                const diff = Math.round(recentAvg - olderAvg);
                if (diff > 0) out.push({ icon: '📈', type: 'success', title: 'Improving!', text: `Your recent scores are ${diff}% higher than before. Great momentum!` });
                else if (diff < 0) out.push({ icon: '📉', type: 'warning', title: 'Slipping slightly', text: `Recent scores are ${Math.abs(diff)}% lower. Try shorter study sessions to refocus.` });
            }
        }

        if (!out.length) out.push({ icon: '🚀', type: 'info', title: 'Just Getting Started!', text: 'Complete more quizzes to unlock detailed insights about your performance.' });
        return out;
    }, [stats]);

    const summaryStats = useMemo(() => [
        {
            label: 'Average Score',
            value: filteredResults.length
                ? `${Math.round(filteredResults.reduce((a, b) => a + b.percentage, 0) / filteredResults.length)}%`
                : `${stats?.averageScore || 0}%`,
            icon: <TrendingUp size={24} />
        },
        { label: 'Total Quizzes', value: user?.stats?.totalQuizzes || 0, icon: <Target size={24} /> },
        {
            label: 'Best Category',
            value: stats?.categoryStats?.length
                ? stats.categoryStats.sort((a, b) => b.avgScore - a.avgScore)[0]?.category?.toUpperCase()
                : 'N/A',
            icon: <Award size={24} />
        },
        { label: 'Streak', value: `${user?.stats?.currentStreak || 0} days`, icon: <Calendar size={24} /> }
    ], [filteredResults, stats, user]);

    const chartOptions = (minY = 0) => ({
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'bottom', labels: { color: isDark ? 'hsl(0,0%,95%)' : 'hsl(222,47%,11%)', padding: 15, font: { size: 12, weight: '500' } } },
            tooltip: { backgroundColor: isDark ? 'hsl(217,33%,17%)' : '#fff', titleColor: isDark ? '#f0f0f0' : '#1a1a2e', bodyColor: isDark ? '#aaa' : '#555', borderColor: isDark ? '#333' : '#ddd', borderWidth: 1, padding: 12 }
        },
        scales: {
            y: { beginAtZero: true, min: minY, max: 100, grid: { color: isDark ? 'hsla(217,33%,25%,0.5)' : 'hsla(214,15%,85%,0.5)' }, ticks: { color: isDark ? '#9ca3af' : '#555', callback: v => `${v}%` } },
            x: { grid: { display: false }, ticks: { color: isDark ? '#9ca3af' : '#555' } }
        }
    });

    const doughnutOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: isDark ? '#f0f0f0' : '#1a1a2e', padding: 15, font: { size: 12 } } } }
    };

    return (
        <div className="analytics-page">
            <div className="analytics-container container">
                {/* Header */}
                <Motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="analytics-header">
                    <div className="header-content">
                        <div className="analytics-icon-wrapper"><BarChart3 size={48} /></div>
                        <h1 className="page-title">Analytics Dashboard</h1>
                        <p className="page-subtitle">Track your learning progress with real data</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button onClick={fetchStats} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} title="Refresh">
                            <RefreshCw size={18} />
                        </button>
                        <div className="time-range-selector">
                            <Filter size={20} />
                            {['7d', '30d', '90d', 'all'].map(range => (
                                <Button key={range} variant={timeRange === range ? 'primary' : 'ghost'} size="sm" onClick={() => setTimeRange(range)}>
                                    {range === 'all' ? 'All Time' : range.toUpperCase()}
                                </Button>
                            ))}
                        </div>
                    </div>
                </Motion.div>

                {/* Loading / Error */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div className="spinner spinner-lg"></div>
                    </div>
                ) : error ? (
                    <Card style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: 'var(--error)', marginBottom: '16px' }}>{error}</p>
                        <Button variant="primary" onClick={fetchStats}>Retry</Button>
                    </Card>
                ) : (
                    <>
                        {/* Summary Stats */}
                        <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="stats-grid">
                            {summaryStats.map((stat, i) => (
                                <Card key={i} className="stat-card" hoverable>
                                    <div className="stat-icon-wrapper">{stat.icon}</div>
                                    <div className="stat-info">
                                        <div className="stat-label">{stat.label}</div>
                                        <div className="stat-value">{stat.value}</div>
                                    </div>
                                </Card>
                            ))}
                        </Motion.div>

                        {/* No data state */}
                        {filteredResults.length === 0 ? (
                            <Card style={{ textAlign: 'center', padding: '60px 40px' }}>
                                <p style={{ fontSize: '2rem', marginBottom: '16px' }}>📊</p>
                                <h3 style={{ marginBottom: '8px' }}>No quiz data yet</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Complete some quizzes to see your analytics here!</p>
                            </Card>
                        ) : (
                            <div className="charts-section">
                                {/* Performance Over Time */}
                                {performanceData && (
                                    <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                        <Card className="chart-card">
                                            <div className="chart-header">
                                                <h2 className="chart-title">Score Trend</h2>
                                                <p className="chart-subtitle">Weekly average — {filteredResults.length} quizzes in range</p>
                                            </div>
                                            <div className="chart-wrapper">
                                                <Line data={performanceData} options={chartOptions(0)} />
                                            </div>
                                        </Card>
                                    </Motion.div>
                                )}

                                {/* Category Breakdown + Day-of-Week */}
                                <div className="charts-row">
                                    {categoryData && (
                                        <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
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
                                    )}

                                    {accuracyData && (
                                        <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                                            <Card className="chart-card">
                                                <div className="chart-header">
                                                    <h2 className="chart-title">Day-of-Week Accuracy</h2>
                                                    <p className="chart-subtitle">When do you perform best?</p>
                                                </div>
                                                <div className="chart-wrapper chart-small">
                                                    <Bar data={accuracyData} options={chartOptions(0)} />
                                                </div>
                                            </Card>
                                        </Motion.div>
                                    )}
                                </div>

                                {/* Category Score Table */}
                                {stats?.categoryStats?.length > 0 && (
                                    <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}>
                                        <Card className="chart-card">
                                            <div className="chart-header">
                                                <h2 className="chart-title">Category Performance</h2>
                                                <p className="chart-subtitle">Average score and quiz counts from your history</p>
                                            </div>
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                                    <thead>
                                                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                                            <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Subject</th>
                                                            <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Quizzes</th>
                                                            <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Avg Score</th>
                                                            <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Progress</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {stats.categoryStats.sort((a, b) => b.avgScore - a.avgScore).map(cat => (
                                                            <tr key={cat.category} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                                                <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: CATEGORY_COLORS[cat.category] || '#888', flexShrink: 0 }}></span>
                                                                        {cat.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                                    </span>
                                                                </td>
                                                                <td style={{ textAlign: 'center', padding: '12px 16px' }}>{cat.count}</td>
                                                                <td style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600, color: cat.avgScore >= 70 ? 'var(--success)' : 'var(--warning)' }}>{cat.avgScore}%</td>
                                                                <td style={{ padding: '12px 16px', minWidth: '120px' }}>
                                                                    <div style={{ background: 'var(--bg-secondary)', borderRadius: '4px', height: '8px' }}>
                                                                        <div style={{ height: '100%', borderRadius: '4px', background: CATEGORY_COLORS[cat.category] || '#888', width: `${cat.avgScore}%` }}></div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Card>
                                    </Motion.div>
                                )}
                            </div>
                        )}

                        {/* Insights */}
                        <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                            <Card className="insights-card">
                                <h2 className="section-title">AI Insights</h2>
                                <div className="insights-grid">
                                    {insights.map((ins, i) => (
                                        <div key={i} className="insight-item">
                                            <div className={`insight-icon ${ins.type}`}>{ins.icon}</div>
                                            <div className="insight-content">
                                                <h3 className="insight-title">{ins.title}</h3>
                                                <p className="insight-text">{ins.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </Motion.div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;
