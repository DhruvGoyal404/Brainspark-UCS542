import { ChevronDown } from 'lucide-react';
import './Select.css';

const Select = ({
    label,
    options = [],
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    placeholder = 'Select an option...',
    className = '',
    ...props
}) => {
    return (
        <div className={`select-wrapper ${className}`}>
            {label && (
                <label className="select-label">
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}

            <div className={`select-container ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
                <select
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className="select-input"
                    {...props}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((option, index) => (
                        <option
                            key={option.value || index}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="select-icon" size={20} />
            </div>

            {error && <span className="select-error">{error}</span>}
        </div>
    );
};

export default Select;
