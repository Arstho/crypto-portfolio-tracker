import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Goal {
  id: string;
  type: 'profit' | 'value' | 'percent';
  target: number;
  current: number;
  deadline?: string;
  name: string;
  reached?: boolean;
  reachedDate?: string;
}

interface GoalsState {
  goals: Goal[];
}

const loadFromStorage = (): Goal[] => {
  try {
    const saved = localStorage.getItem('portfolioGoals');
    console.log('Loading goals from storage:', saved);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading goals:', error);
    return [];
  }
};

const initialState: GoalsState = {
  goals: loadFromStorage(),
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<Goal>) => {
      console.log('Adding goal:', action.payload);
      state.goals.push(action.payload);
      localStorage.setItem('portfolioGoals', JSON.stringify(state.goals));
    },
    updateGoal: (state, action: PayloadAction<Goal>) => {
      const index = state.goals.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = action.payload;
        localStorage.setItem('portfolioGoals', JSON.stringify(state.goals));
      }
    },
    removeGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter((g) => g.id !== action.payload);
      localStorage.setItem('portfolioGoals', JSON.stringify(state.goals));
    },
    updateGoals: (state, action: PayloadAction<Goal[]>) => {
      console.log('Updating goals:', action.payload);
      state.goals = action.payload;
      localStorage.setItem('portfolioGoals', JSON.stringify(state.goals));
    },
    clearGoals: (state) => {
      state.goals = [];
      localStorage.removeItem('portfolioGoals');
    },
  },
});

export const { addGoal, updateGoal, removeGoal, updateGoals, clearGoals } =
  goalsSlice.actions;
export default goalsSlice.reducer;
