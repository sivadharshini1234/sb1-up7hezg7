import React, { useState, useEffect } from 'react';
import { PlusCircle, Filter, SearchIcon } from 'lucide-react';
import { useProgress, Goal } from '../contexts/ProgressContext';
import GoalCard from '../components/progress/GoalCard';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const GoalsPage: React.FC = () => {
  const { goals, isLoading, fetchGoals } = useProgress();
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  useEffect(() => {
    let result = [...goals];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(goal => 
        goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'All') {
      result = result.filter(goal => goal.category === categoryFilter);
    }
    
    setFilteredGoals(result);
  }, [goals, searchTerm, categoryFilter]);

  const uniqueCategories = ['All', ...new Set(goals.map(goal => goal.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
        <Button 
          onClick={() => setShowAddGoalForm(true)}
          icon={<PlusCircle className="h-5 w-5" />}
        >
          Add New Goal
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onEdit={(goal) => console.log('Edit', goal)}
              onDelete={(id) => console.log('Delete', id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="py-12 flex flex-col items-center justify-center text-center">
            <PlusCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No goals found</h3>
            <p className="text-gray-500 mb-4">
              {goals.length === 0 
                ? "Start tracking your progress by creating your first goal"
                : "Try adjusting your filters to find what you're looking for"}
            </p>
            {goals.length === 0 && (
              <Button 
                onClick={() => setShowAddGoalForm(true)}
                icon={<PlusCircle className="h-5 w-5" />}
              >
                Create Goal
              </Button>
            )}
          </CardBody>
        </Card>
      )}

      {/* Placeholder for add goal form - would be implemented as a modal in a full application */}
      {showAddGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardBody>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Goal</h3>
              <p className="text-gray-500 mb-4">Form would be implemented here in a full application</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddGoalForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddGoalForm(false)}>
                  Add Goal
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;