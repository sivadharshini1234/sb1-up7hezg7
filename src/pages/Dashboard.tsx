import React, { useEffect } from 'react';
import { PlusCircle, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import ProgressSummaryCard from '../components/progress/ProgressSummaryCard';
import GoalCard from '../components/progress/GoalCard';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { goals, isLoading, fetchGoals } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const recentGoals = goals.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button 
          onClick={() => navigate('/goals')}
          icon={<PlusCircle className="h-5 w-5" />}
        >
          Manage Goals
        </Button>
      </div>

      <div className="mb-8">
        <ProgressSummaryCard />
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Goals</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/goals')}
          >
            View All
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : recentGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentGoals.map(goal => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="py-12 flex flex-col items-center justify-center text-center">
              <BarChart2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No goals yet</h3>
              <p className="text-gray-500 mb-4">Start tracking your progress by creating your first goal</p>
              <Button 
                onClick={() => navigate('/goals')}
                icon={<PlusCircle className="h-5 w-5" />}
              >
                Create Goal
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;