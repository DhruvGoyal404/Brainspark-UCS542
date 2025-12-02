import './QuestionProgress.css';

const QuestionProgress = ({
    current,
    total,
    percentage = 0
}) => {
    return (
        <div className="question-progress">
            <div className="progress-header">
                <span className="progress-text">
                    Question {current} of {total}
                </span>
                <span className="progress-percentage">{Math.round(percentage)}%</span>
            </div>
            <div className="progress-bar-track">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default QuestionProgress;
