import './StreakCalendar.css';

const StreakCalendar = ({
    activityData = [], // Array of { date: 'YYYY-MM-DD', count: number }
    daysToShow = 91 // Show last 3 months by default
}) => {
    const getActivityLevel = (count) => {
        if (count === 0) return 'activity-none';
        if (count <= 1) return 'activity-low';
        if (count <= 2) return 'activity-medium';
        if (count <= 3) return 'activity-high';
        return 'activity-very-high';
    };

    const recentActivity = activityData.slice(-daysToShow);

    return (
        <div className="streak-calendar">
            <div className="calendar-header">
                <h3 className="calendar-title">Activity Streak</h3>
                <div className="calendar-legend">
                    <span className="legend-label">Less</span>
                    <div className="legend-squares">
                        <div className="legend-square activity-none" title="No activity"></div>
                        <div className="legend-square activity-low" title="1 quiz"></div>
                        <div className="legend-square activity-medium" title="2 quizzes"></div>
                        <div className="legend-square activity-high" title="3 quizzes"></div>
                        <div className="legend-square activity-very-high" title="4+ quizzes"></div>
                    </div>
                    <span className="legend-label">More</span>
                </div>
            </div>

            <div className="calendar-grid">
                {recentActivity.map((day, index) => (
                    <div
                        key={index}
                        className={`calendar-day ${getActivityLevel(day.count)}`}
                        title={`${day.date}: ${day.count} ${day.count === 1 ? 'quiz' : 'quizzes'}`}
                        data-date={day.date}
                        data-count={day.count}
                    />
                ))}
            </div>
        </div>
    );
};

export default StreakCalendar;
