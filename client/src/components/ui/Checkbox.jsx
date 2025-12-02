import { Check } from 'lucide-react';
import './Checkbox.css';

const Checkbox = ({
    label,
    checked = false,
    onChange,
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <label className={`checkbox-wrapper ${disabled ? 'disabled' : ''} ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="checkbox-input"
                {...props}
            />
            <span className={`checkbox-box ${checked ? 'checked' : ''}`}>
                {checked && <Check size={16} className="checkbox-icon" />}
            </span>
            {label && <span className="checkbox-label">{label}</span>}
        </label>
    );
};

export default Checkbox;
