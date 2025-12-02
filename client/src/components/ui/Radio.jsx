import './Radio.css';

const Radio = ({
    label,
    name,
    value,
    checked = false,
    onChange,
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <label className={`radio-wrapper ${disabled ? 'disabled' : ''} ${className}`}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="radio-input"
                {...props}
            />
            <span className={`radio-button ${checked ? 'checked' : ''}`}>
                <span className="radio-dot"></span>
            </span>
            {label && <span className="radio-label">{label}</span>}
        </label>
    );
};

const RadioGroup = ({ children, className = '' }) => {
    return (
        <div className={`radio-group ${className}`} role="radiogroup">
            {children}
        </div>
    );
};

Radio.Group = RadioGroup;

export default Radio;
