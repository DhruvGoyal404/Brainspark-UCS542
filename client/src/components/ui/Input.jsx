import './Input.css';

const Input = ({
    type = 'text',
    label,
    id,
    name,
    value,
    onChange,
    placeholder,
    error,
    icon,
    disabled = false,
    required = false,
    className = '',
    ...props
}) => {
    const inputClasses = [
        'input-field',
        error && 'input-error',
        icon && 'input-with-icon',
        disabled && 'input-disabled',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className="input-group">
            {label && (
                <label htmlFor={id} className="input-label">
                    {label}
                    {required && <span className="required-indicator">*</span>}
                </label>
            )}

            <div className="input-wrapper">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    type={type}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={inputClasses}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${id}-error` : undefined}
                    {...props}
                />
            </div>

            {error && (
                <span id={`${id}-error`} className="input-error-message" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
