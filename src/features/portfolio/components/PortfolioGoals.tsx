import React, { useEffect, useState } from 'react';
import { FormatPrice } from '../../../shared/components/FormatPrice/FormatPrice';
import type { Goal } from '../goalsSlice';

interface PortfolioGoalsProps {
  currentValue: number;
  totalProfit: number;
  profitPercentage: number;
  goals: Goal[];
  onAddGoal: (
    goal: Omit<Goal, 'id' | 'reached' | 'reachedDate' | 'current'>
  ) => void;
  onRemoveGoal: (id: string) => void;
  onGoalReached?: (goal: Goal) => void;
}

type GoalType = 'profit' | 'value' | 'percent';

interface NewGoalState {
  type: GoalType;
  target: string;
  deadline: string;
  name: string;
}

export const PortfolioGoals: React.FC<PortfolioGoalsProps> = ({
  currentValue,
  totalProfit,
  profitPercentage,
  goals,
  onAddGoal,
  onRemoveGoal,
  onGoalReached,
}) => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<NewGoalState>({
    type: 'profit',
    target: '',
    deadline: '',
    name: '',
  });

  useEffect(() => {
    goals.forEach((goal) => {
      if (goal.reached) return;

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
        onGoalReached?.(goal);
      }
    });
  }, [currentValue, totalProfit, profitPercentage, goals, onGoalReached]);

  const handleAddGoal = () => {
    if (!newGoal.target || !newGoal.name) return;

    onAddGoal({
      type: newGoal.type,
      target: parseFloat(newGoal.target),
      deadline: newGoal.deadline || undefined,
      name: newGoal.name,
    });

    setShowAddGoal(false);
    setNewGoal({ type: 'profit', target: '', deadline: '', name: '' });
  };

  const getProgress = (goal: Goal) => {
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
    return Math.min(100, (current / goal.target) * 100);
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'profit':
        return '💰';
      case 'value':
        return '💎';
      case 'percent':
        return '📈';
      default:
        return '🎯';
    }
  };

  const getGoalColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          🎯 Portfolio Goals
        </h2>
        <button
          onClick={() => setShowAddGoal(true)}
          className="btn-primary text-sm flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Goal
        </button>
      </div>

      {showAddGoal && (
        <div className="mb-4 p-4 bg-[var(--hover-bg)] rounded-lg border border-[var(--border-color)]">
          <h3 className="font-medium text-[var(--text-primary)] mb-3">
            Create New Goal
          </h3>

          <div className="space-y-3">
            <input
              type="text"
              value={newGoal.name}
              onChange={(e) =>
                setNewGoal((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Goal name (e.g., 'First $10k')"
              className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
            />

            <select
              value={newGoal.type}
              onChange={(e) =>
                setNewGoal((prev) => ({
                  ...prev,
                  type: e.target.value as GoalType,
                }))
              }
              className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-primary)]"
            >
              <option value="profit">Profit ($)</option>
              <option value="value">Portfolio Value ($)</option>
              <option value="percent">Return (%)</option>
            </select>

            <input
              type="number"
              value={newGoal.target}
              onChange={(e) =>
                setNewGoal((prev) => ({ ...prev, target: e.target.value }))
              }
              placeholder="Target amount"
              className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
            />

            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) =>
                setNewGoal((prev) => ({ ...prev, deadline: e.target.value }))
              }
              className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-primary)]"
            />

            <div className="flex gap-2">
              <button onClick={handleAddGoal} className="flex-1 btn-primary">
                Save Goal
              </button>
              <button
                onClick={() => setShowAddGoal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {goals.length === 0 && !showAddGoal ? (
        <div className="text-center py-8 bg-[var(--hover-bg)] rounded-lg border-2 border-dashed border-[var(--border-color)]">
          <p className="text-[var(--text-secondary)] mb-2">No goals set yet</p>
          <p className="text-sm text-[var(--text-secondary)]">
            Add goals to track your progress
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = getProgress(goal);
            const reached = progress >= 100;

            return (
              <div key={goal.id} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getGoalIcon(goal.type)}</span>
                    <span className="font-medium text-[var(--text-primary)]">
                      {goal.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {goal.type === 'profit' && (
                        <FormatPrice value={goal.target} />
                      )}
                      {goal.type === 'value' && (
                        <FormatPrice value={goal.target} />
                      )}
                      {goal.type === 'percent' && `${goal.target}%`}
                    </span>
                    <button
                      onClick={() => onRemoveGoal(goal.id)}
                      className="text-[var(--text-secondary)] hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="relative h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full ${getGoalColor(progress)} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between mt-1 text-xs">
                  <span className="text-[var(--text-secondary)]">
                    Progress: {progress.toFixed(1)}%
                  </span>
                  {goal.deadline && (
                    <span className="text-[var(--text-secondary)]">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {reached && (
                  <div className="absolute -top-1.5 -right-1.5">
                    <span className="flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
