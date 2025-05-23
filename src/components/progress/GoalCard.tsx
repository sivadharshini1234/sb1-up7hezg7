import React, { useState } from 'react';
import { Calendar, Edit3, Trash2 } from 'lucide-react';
import Card, { CardBody, CardFooter } from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';
import { Goal, useProgress } from '../../contexts/ProgressContext';

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ 
  goal,
  onEdit,
  onDelete,
}) => {
  const { updateGoalProgress } = useProgress();
  const [isUpdating, setIsUpdating] = useState(false);
  const [newValue, setNewValue] = useState(goal.currentValue.toString());

  const progressPercentage = Math.min(100, (goal.currentValue / goal.targetValue) * 100);
  const isCompleted = progressPercentage >= 100;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleUpdateSubmit = async () => {
    const parsedValue = parseFloat(newValue);
    if (isNaN(parsedValue) || parsedValue < 0) return;

    try {
      await updateGoalProgress(goal.id, parsedValue);
      setIsUpdating(false);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const getCategoryClass = (category: string) => {
    const categories: Record<string, string> = {
      'Work': 'bg-blue-100 text-blue-800',
      'Learning': 'bg-purple-100 text-purple-800',
      'Health': 'bg-green-100 text-green-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Personal': 'bg-red-100 text-red-800',
    };
    
    return categories[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-md">
      <CardBody>
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryClass(goal.category)}`}>
            {goal.category}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </span>
          </div>
          <ProgressBar 
            value={goal.currentValue} 
            max={goal.targetValue} 
            color={goal.color.replace('#', '')}
            unit={goal.unit}
          />
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mt-2">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
          </span>
        </div>
      </CardBody>
      
      <CardFooter className="bg-gray-50">
        {isUpdating ? (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              min="0"
              max={goal.targetValue * 1.5}
              step="1"
            />
            <Button 
              size="sm" 
              onClick={handleUpdateSubmit}
              variant="primary"
            >
              Save
            </Button>
            <Button 
              size="sm" 
              onClick={() => {
                setNewValue(goal.currentValue.toString());
                setIsUpdating(false);
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex justify-between">
            <Button
              variant={isCompleted ? "success" : "primary"}
              size="sm"
              onClick={() => setIsUpdating(true)}
              disabled={isCompleted}
              icon={<Edit3 className="h-4 w-4" />}
            >
              {isCompleted ? 'Completed' : 'Update Progress'}
            </Button>
            
            {onEdit && onDelete && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(goal)}
                  icon={<Edit3 className="h-4 w-4" />}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(goal.id)}
                  icon={<Trash2 className="h-4 w-4" />}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default GoalCard;