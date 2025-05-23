import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { simulateApiCall } from '../services/api';
import { useAuth } from './AuthContext';

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  category: string;
  color: string;
}

export interface ProgressSummary {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  averageCompletion: number;
}

interface ProgressContextType {
  goals: Goal[];
  isLoading: boolean;
  summary: ProgressSummary;
  fetchGoals: () => Promise<void>;
  updateGoalProgress: (goalId: string, newValue: number) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<Goal>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<ProgressSummary>({
    totalGoals: 0,
    completedGoals: 0,
    inProgressGoals: 0,
    averageCompletion: 0,
  });
  const { isAuthenticated } = useAuth();

  const calculateSummary = useCallback((goalsList: Goal[]): ProgressSummary => {
    const totalGoals = goalsList.length;
    const completedGoals = goalsList.filter(g => g.currentValue >= g.targetValue).length;
    const inProgressGoals = totalGoals - completedGoals;
    
    const completionRates = goalsList.map(g => 
      Math.min(100, (g.currentValue / g.targetValue) * 100)
    );
    
    const averageCompletion = completionRates.length 
      ? completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length
      : 0;
    
    return {
      totalGoals,
      completedGoals,
      inProgressGoals,
      averageCompletion,
    };
  }, []);

  const fetchGoals = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const data = await simulateApiCall<Goal[]>('goals', {}, 1000);
      setGoals(data);
      setSummary(calculateSummary(data));
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  }, [isAuthenticated, calculateSummary]);

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    try {
      await simulateApiCall('updateGoal', { goalId, currentValue: newValue }, 600);
      
      setGoals(prevGoals => {
        const updatedGoals = prevGoals.map(goal => 
          goal.id === goalId ? { ...goal, currentValue: newValue } : goal
        );
        setSummary(calculateSummary(updatedGoals));
        return updatedGoals;
      });
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const addGoal = async (goalData: Omit<Goal, 'id'>): Promise<Goal> => {
    try {
      const newGoal = await simulateApiCall<Goal>(
        'createGoal', 
        goalData, 
        800
      );
      
      setGoals(prevGoals => {
        const updatedGoals = [...prevGoals, newGoal];
        setSummary(calculateSummary(updatedGoals));
        return updatedGoals;
      });
      
      return newGoal;
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isAuthenticated && goals.length === 0) {
      fetchGoals();
    } else if (!isAuthenticated) {
      setGoals([]);
      setSummary({
        totalGoals: 0,
        completedGoals: 0,
        inProgressGoals: 0,
        averageCompletion: 0,
      });
    }
  }, [isAuthenticated, fetchGoals, goals.length]);

  return (
    <ProgressContext.Provider 
      value={{ 
        goals, 
        isLoading, 
        summary, 
        fetchGoals, 
        updateGoalProgress,
        addGoal,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};