import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = 'blue-500' 
}) => {
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClass[size]} animate-spin`}>
        <div className={`h-full w-full rounded-full border-4 border-t-${color} border-b-${color} border-l-${color} border-r-${color}/30`}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;