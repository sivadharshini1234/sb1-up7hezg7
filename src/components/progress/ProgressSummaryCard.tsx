import React from 'react';
import { CheckCircle, Circle, TrendingUp } from 'lucide-react';
import Card, { CardBody } from '../ui/Card';
import { useProgress } from '../../contexts/ProgressContext';

const ProgressSummaryCard: React.FC = () => {
  const { summary } = useProgress();
  
  return (
    <Card>
      <CardBody>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-semibold text-gray-900">{summary.completedGoals}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Circle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-xl font-semibold text-gray-900">{summary.inProgressGoals}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Completion</p>
              <p className="text-xl font-semibold text-gray-900">{summary.averageCompletion.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
              style={{ width: `${summary.averageCompletion}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">0%</span>
            <span className="text-xs text-gray-500">50%</span>
            <span className="text-xs text-gray-500">100%</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProgressSummaryCard;