import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import type { Goal } from '../goalsSlice';
import { addGoal, clearGoals, removeGoal, updateGoals } from '../goalsSlice';

export const useGoals = () => {
  const dispatch = useAppDispatch();
  const goals = useAppSelector((state) => state.goals.goals);

  useEffect(() => {
    console.log('Current goals in store:', goals);
  }, [goals]);

  const addNewGoal = useCallback(
    (goal: Omit<Goal, 'id' | 'reached' | 'reachedDate' | 'current'>) => {
      const newGoal: Goal = {
        ...goal,
        id: crypto.randomUUID(),
        current: 0,
        reached: false,
      };
      console.log('Dispatching addGoal:', newGoal);
      dispatch(addGoal(newGoal));
    },
    [dispatch]
  );

  const checkAndUpdateGoals = useCallback(
    (currentValue: number, totalProfit: number, profitPercentage: number) => {
      let hasChanges = false;

      const updatedGoals = goals.map((goal) => {
        if (goal.reached) return goal;

        let current = 0;
        switch (goal.type) {
          case 'profit':
            current = totalProfit;
            break;
          case 'value':
            current = currentValue;
            break;
          case 'percent':
            current = profitPercentage;
            break;
        }

        if (current >= goal.target) {
          hasChanges = true;
          return {
            ...goal,
            reached: true,
            reachedDate: new Date().toISOString(),
          };
        }
        return goal;
      });

      if (hasChanges) {
        console.log('Goals reached! Updating...');
        dispatch(updateGoals(updatedGoals));
      }
    },
    [goals, dispatch]
  );

  return {
    goals,
    addNewGoal,
    removeGoal: (id: string) => {
      console.log('Removing goal:', id);
      dispatch(removeGoal(id));
    },
    checkAndUpdateGoals,
    clearAllGoals: () => {
      console.log('Clearing all goals');
      dispatch(clearGoals());
    },
  };
};
