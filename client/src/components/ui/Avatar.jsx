import { User } from 'lucide-react';
import './Avatar.css';

const Avatar = ({
    src,
    alt = 'User avatar',
    size = 'md', // sm, md, lg, xl
    fallback,
    className = '',
    ...props
}) => {
    const sizeClass = `avatar-${size}`;

    return (
        <div className={`avatar ${sizeClass} ${className}`} {...props}>
            {src ? (
                <img src={src} alt={alt} className="avatar-image" />
            ) : fallback ? (
                <span className="avatar-fallback">{fallback}</span>
            ) : (
                <User className="avatar-icon" />
            )}
        </div>
    );
};

export default Avatar;
