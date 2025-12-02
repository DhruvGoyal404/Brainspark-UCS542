import Select from '../ui/Select';
import './FilterControls.css';

const FilterControls = ({
    timePeriod,
    onTimePeriodChange,
    category,
    onCategoryChange,
    categories = []
}) => {
    const timePeriodOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'year', label: 'This Year' },
    ];

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        ...categories.map(cat => ({ value: cat, label: cat })),
    ];

    return (
        <div className="filter-controls">
            <Select
                label="Time Period"
                options={timePeriodOptions}
                value={timePeriod}
                onChange={(e) => onTimePeriodChange(e.target.value)}
            />

            <Select
                label="Category"
                options={categoryOptions}
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
            />
        </div>
    );
};

export default FilterControls;
