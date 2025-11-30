import './Progress.css';

// Linear Progress Bar
export const ProgressBar = ({
    value = 0,
    max = 100,
    size = 'md',
    variant = 'primary',
    showLabel = false,
    label = '',
    className = '',
    ...props
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const classes = [
        'progress-bar',
        `progress-bar-${size}`,
        `progress-bar-${variant}`,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className="progress-container">
            {(showLabel || label) && (
                <div className="progress-header">
                    <span className="progress-label">{label || `${Math.round(percentage)}%`}</span>
                    {label && <span className="progress-percentage">{Math.round(percentage)}%</span>}
                </div>
            )}
            <div className={classes} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} {...props}>
                <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

// Circular Progress
export const ProgressCircle = ({
    value = 0,
    max = 100,
    size = 100,
    strokeWidth = 8,
    variant = 'primary',
    showLabel = true,
    label = '',
    className = '',
    ...props
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    const colorMap = {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--info)'
    };

    const strokeColor = colorMap[variant] || colorMap.primary;

    return (
        <div className={`progress-circle ${className}`} style={{ width: size, height: size }} {...props}>
            <svg width={size} height={size}>
                <circle
                    className="progress-circle-bg"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <circle
                    className="progress-circle-fill"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke={strokeColor}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>
            {showLabel && (
                <div className="progress-circle-label">
                    <span className="progress-circle-value">{label || `${Math.round(percentage)}%`}</span>
                </div>
            )}
        </div>
    );
};

const Progress = ProgressBar;
export default Progress;
