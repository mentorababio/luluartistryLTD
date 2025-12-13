"use client";

interface FilterOption {
  id: string;
  name: string;
  count: number;
}

interface FilterTabsProps {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  className?: string;
}

const FilterTabs = ({ filters, activeFilter, onFilterChange, className = "" }: FilterTabsProps) => {
  return (
    <div className={`flex flex-wrap gap-2 justify-center ${className}`}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeFilter === filter.id
              ? 'bg-primary-gold text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter.name}
          {filter.count > 0 && (
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeFilter === filter.id
                ? 'bg-white/20'
                : 'bg-gray-200'
            }`}>
              {filter.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;