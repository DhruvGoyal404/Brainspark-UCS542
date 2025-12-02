import './Toggle.css';

const Toggle = ({
    checked = false,
    onChange,
    disabled = false,
    label,
    className = '',
    ...props
}) => {
    return (
        <label className={`toggle-wrapper ${disabled ? 'disabled' : ''} ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="toggle-input"
                {...props}
            />
            <span className="toggle-track">
                <span className="toggle-thumb"></span>
            </span>
            {label && <span className="toggle-label">{label}</span>}
        </label>
    );
};

export default Toggle;
