import { useState } from 'react';
import './Tooltip.css';

const Tooltip = ({
    children,
    content,
    position = 'top', // top, bottom, left, right
    delay = 200,
    className = ''
}) => {
    const [visible, setVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    const showTooltip = () => {
        const id = setTimeout(() => {
            setVisible(true);
        }, delay);
        setTimeoutId(id);
    };

    const hideTooltip = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setVisible(false);
    };

    if (!content) return children;

    return (
        <div
            className={`tooltip-wrapper ${className}`}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}
            {visible && (
                <div className={`tooltip-content tooltip-${position}`} role="tooltip">
                    {content}
                    <div className="tooltip-arrow"></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
