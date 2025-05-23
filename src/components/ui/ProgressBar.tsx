import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  showValue?: boolean;
  unit?: string;
  height?: string;
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  color = 'blue-500',
  showValue = true,
  unit = '%',
  height = 'h-4',
  animated = true,
  className = '',
}) => {
  const [width, setWidth] = useState(0);

  // Calculate percentage
  const percentage = Math.min(100, Math.round((value / max) * 100));
  
  // Formatted display value
  const displayValue = unit === '%' ? percentage : value;

  // Animate progress bar on mount and when value changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height} ${className}`}>
      <div
        className={`bg-${color} ${animated ? 'transition-all duration-1000 ease-out' : ''} rounded-full h-full flex items-center justify-end px-2`}
        style={{ width: `${width}%` }}
      >
        {showValue && width > 15 && (
          <span className="text-white text-xs font-semibold">
            {displayValue}{unit}
          </span>
        )}
      </div>
      {showValue && width <= 15 && (
        <div className="relative">
          <span className={`absolute right-0 -top-6 text-${color} text-xs font-semibold`}>
            {displayValue}{unit}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;