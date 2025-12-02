import './Skeleton.css';

const Skeleton = ({
    variant = 'text', // text, circular, rectangular
    width,
    height,
    className = '',
    count = 1,
    ...props
}) => {
    const skeletonClass = `skeleton skeleton-${variant} ${className}`;
    const style = {
        width: width,
        height: height,
    };

    if (count > 1) {
        return (
            <div className="skeleton-group">
                {Array.from({ length: count }).map((_, index) => (
                    <div key={index} className={skeletonClass} style={style} {...props} />
                ))}
            </div>
        );
    }

    return <div className={skeletonClass} style={style} {...props} />;
};

export default Skeleton;
