import { Check, X } from 'lucide-react';
import './AnswerOption.css';

const AnswerOption = ({
    option,
    isSelected,
    isCorrect,
    isIncorrect,
    showFeedback,
    onClick,
    disabled = false
}) => {
    const getClassName = () => {
        let className = 'answer-option';
        if (isSelected) className += ' selected';
        if (showFeedback && isCorrect) className += ' correct';
        if (showFeedback && isIncorrect) className += ' incorrect';
        if (disabled) className += ' disabled';
        return className;
    };

    return (
        <button
            className={getClassName()}
            onClick={onClick}
            disabled={disabled}
            type="button"
        >
            <span className="option-label">{option.id}</span>
            <span className="option-text">{option.text}</span>
            {showFeedback && isCorrect && (
                <Check className="feedback-icon correct-icon" size={20} />
            )}
            {showFeedback && isIncorrect && (
                <X className="feedback-icon incorrect-icon" size={20} />
            )}
        </button>
    );
};

export default AnswerOption;
