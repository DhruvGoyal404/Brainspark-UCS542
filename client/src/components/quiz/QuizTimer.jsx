import { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import './QuizTimer.css';

const QuizTimer = ({
    initialTime, // in seconds
    onTimeUp,
    isActive = true,
    warningThreshold = 60, // seconds
    className = ''
}) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isWarning, setIsWarning] = useState(false);

    useEffect(() => {
        setTimeLeft(initialTime);
    }, [initialTime]);

    useEffect(() => {
        if (!isActive || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const newTime = prev - 1;

                if (newTime <= 0) {
                    clearInterval(interval);
                    if (onTimeUp) onTimeUp();
                    return 0;
                }

                if (newTime <= warningThreshold && !isWarning) {
                    setIsWarning(true);
                }

                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onTimeUp, warningThreshold, isWarning]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const percentage = (timeLeft / initialTime) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`quiz-timer ${isWarning ? 'warning' : ''} ${className}`}>
            <div className="timer-circle">
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle
                        className="timer-circle-bg"
                        cx="50"
                        cy="50"
                        r="45"
                    />
                    <circle
                        className="timer-circle-progress"
                        cx="50"
                        cy="50"
                        r="45"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                        }}
                    />
                </svg>
                <div className="timer-content">
                    {isWarning ? (
                        <AlertCircle className="timer-icon" size={20} />
                    ) : (
                        <Clock className="timer-icon" size={20} />
                    )}
                    <div className="timer-text">{formatTime(timeLeft)}</div>
                </div>
            </div>
        </div>
    );
};

export default QuizTimer;
