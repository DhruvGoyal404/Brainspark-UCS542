import './Card.css';

const Card = ({
    children,
    variant = 'default',
    padding = 'md',
    hoverable = false,
    clickable = false,
    onClick,
    className = '',
    ...props
}) => {
    const classes = [
        'card',
        `card-${variant}`,
        `card-padding-${padding}`,
        hoverable && 'card-hoverable',
        clickable && 'card-clickable',
        className
    ].filter(Boolean).join(' ');

    const handleClick = () => {
        if (clickable && onClick) {
            onClick();
        }
    };

    return (
        <div
            className={classes}
            onClick={handleClick}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
