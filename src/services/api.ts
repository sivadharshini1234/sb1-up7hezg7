import { Goal } from '../contexts/ProgressContext';

// Mock data for the simulated API
const mockUsers = [
  {
    id: 'user-1',
    name: 'Pragadeesh',
    email: 'praga8504@gmail.com',
    password: 'password123', // In a real app, passwords would never be stored like this
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

const mockGoals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Complete Coding Project',
    description: 'Finish the React application for client presentation',
    targetValue: 100,
    currentValue: 65,
    unit: '%',
    startDate: '2025-02-01',
    endDate: '2025-03-15',
    category: 'Work',
    color: '#3B82F6',
  },
  {
    id: 'goal-2',
    title: 'Read Programming Book',
    description: 'Finish "Clean Code" by Robert C. Martin',
    targetValue: 320,
    currentValue: 180,
    unit: 'pages',
    startDate: '2025-01-15',
    endDate: '2025-04-01',
    category: 'Learning',
    color: '#8B5CF6',
  },
  {
    id: 'goal-3',
    title: 'Exercise Routine',
    description: 'Regular gym sessions for better health',
    targetValue: 20,
    currentValue: 8,
    unit: 'sessions',
    startDate: '2025-02-01',
    endDate: '2025-02-28',
    category: 'Health',
    color: '#10B981',
  },
  {
    id: 'goal-4',
    title: 'Save Money',
    description: 'Monthly savings goal',
    targetValue: 1000,
    currentValue: 450,
    unit: '$',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    category: 'Finance',
    color: '#F59E0B',
  },
];

// Simulate API calls with artificial delay
export const simulateApiCall = <T>(
  endpoint: string,
  data: any = {},
  delay: number = 500
): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      switch (endpoint) {
        case 'login':
          const user = mockUsers.find(u => u.email === data.email);
          if (user && user.password === data.password) {
            // Never send password in response
            const { password, ...safeUserData } = user;
            resolve(safeUserData as unknown as T);
          } else {
            reject(new Error('Invalid credentials'));
          }
          break;

        case 'goals':
          resolve(mockGoals as unknown as T);
          break;

        case 'updateGoal':
          resolve({ success: true } as unknown as T);
          break;

        case 'createGoal':
          const newGoal: Goal = {
            id: `goal-${Date.now()}`,
            ...data,
          };
          resolve(newGoal as unknown as T);
          break;

        default:
          reject(new Error(`Unknown endpoint: ${endpoint}`));
      }
    }, delay);
  });
};