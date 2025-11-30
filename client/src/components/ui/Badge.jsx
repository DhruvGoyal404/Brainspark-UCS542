import './Badge.css';

const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    pill = false,
    icon = null,
    className = '',
    ...props
}) => {
    const classes = [
        'badge',
        `badge-${variant}`,
        `badge-${size}`,
        pill && 'badge-pill',
        className
    ].filter(Boolean).join(' ');

    return (
        <span className={classes} {...props}>
            {icon && <span className="badge-icon">{icon}</span>}
            {children}
        </span>
    );
};

export default Badge;
