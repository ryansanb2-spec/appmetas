// Caminho: src/context/DataContext.jsx
import React, { createContext, useReducer, useContext } from 'react';
import partyIcon from '../assets/icon-party.svg';
import checkIcon from '../assets/icon-check.svg';
import flagIcon from '../assets/icon-flag.svg';
import trophyIcon from '../assets/icon-trophy.svg';
import brainIcon from '../assets/icon-brain.svg';
import disciplineIcon from '../assets/icon-discipline.svg';
import heartIcon from '../assets/icon-heart.svg';

const ATTRIBUTE_ICON_MAP = {
  '🧠': brainIcon,
  '💪': disciplineIcon,
  '❤️': heartIcon,
};

// --- FUNÇÕES HELPER ---
const calculateXpToNextLevel = (level) => 50 * level ** 2 + 50 * level;

const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

// --- DADOS INICIAIS ---
const INITIAL_DATA = {
  user: { name: 'Hyan', coins: 0, freezeTokens: 1, level: 1 },
  attributes: [
    { id: 'attr1', name: '🧠 Inteligência', level: 1, xp: 0, xpToNextLevel: 100 },
    { id: 'attr2', name: '💪 Disciplina', level: 1, xp: 0, xpToNextLevel: 100 },
    { id: 'attr3', name: '❤️ Saúde', level: 1, xp: 0, xpToNextLevel: 100 },
  ],
  goals: [],
  habits: [],
  tasks: [],
  // Para controlar toasts e animações a partir do estado
  toastInfo: null,
  leveledUpAttributeId: null,
};

// --- LÓGICA DE ATUALIZAÇÃO DE ESTADO (O REDUCER) ---
function dataReducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_TASK': {
        const { taskId, attributeId } = action.payload;
        const task = state.tasks.find(t => t.id === taskId);
        if (!task || task.completed) return state;

        const basePoints = { xp: 110, coins: 5 };
        let newState = { ...state };

        newState.tasks = state.tasks.map(t =>
            t.id === taskId ? { ...t, completed: true, completionDate: new Date().toISOString() } : t
        );

        newState.attributes = state.attributes.map(attr => {
            if (attr.id === attributeId) {
                let newXp = attr.xp + basePoints.xp;
                let newLevel = attr.level;
                let xpToNext = attr.xpToNextLevel;
                while (newXp >= xpToNext) {
                    newXp -= xpToNext;
                    newLevel++;
                    xpToNext = calculateXpToNextLevel(newLevel);
                    newState.leveledUpAttributeId = attr.id; // Animação
                    newState.toastInfo = { message: `LEVEL UP! Nível ${newLevel} em ${attr.name.split(' ')[1]}`, icon: partyIcon };
                }
                return { ...attr, xp: newXp, level: newLevel, xpToNextLevel: xpToNext };
            }
            return attr;
        });

        newState.user = { ...state.user, coins: state.user.coins + basePoints.coins };
        if (!newState.toastInfo) {
            newState.toastInfo = { message: 'Missão Cumprida!', icon: checkIcon };
        }
        return newState;
    }

    case 'TOGGLE_SUBTASK': {
        const { taskId, subtaskId } = action.payload;
        let attributeIdToReward = null;
        let newState = { ...state };

        newState.tasks = state.tasks.map(task => {
            if (task.id === taskId) {
                const newSubtasks = task.subtasks.map(st =>
                    st.id === subtaskId ? { ...st, completed: !st.completed } : st
                );
                const allSubtasksCompleted = newSubtasks.every(st => st.completed);
                if (allSubtasksCompleted && !task.completed) {
                    attributeIdToReward = task.linkedAttribute;
                    return { ...task, subtasks: newSubtasks, completed: true, completionDate: new Date().toISOString() };
                }
                if (!allSubtasksCompleted && task.completed) {
                    return { ...task, subtasks: newSubtasks, completed: false, completionDate: null };
                }
                return { ...task, subtasks: newSubtasks };
            }
            return task;
        });

        if (attributeIdToReward) {
            const basePoints = { xp: 110, coins: 5 };
            newState.attributes = newState.attributes.map(attr => {
                 if (attr.id === attributeIdToReward) {
                    let newXp = attr.xp + basePoints.xp;
                    let newLevel = attr.level;
                    let xpToNext = attr.xpToNextLevel;
                    while (newXp >= xpToNext) {
                        newXp -= xpToNext;
                        newLevel++;
                        xpToNext = calculateXpToNextLevel(newLevel);
                        newState.leveledUpAttributeId = attr.id;
                        newState.toastInfo = { message: `LEVEL UP! Nível ${newLevel} em ${attr.name.split(' ')[1]}`, icon: partyIcon };
                    }
                    return { ...attr, xp: newXp, level: newLevel, xpToNextLevel: xpToNext };
                }
                return attr;
            });
            newState.user = { ...newState.user, coins: newState.user.coins + basePoints.coins };
            if (!newState.toastInfo) {
               newState.toastInfo = { message: 'Missão Cumprida!', icon: checkIcon };
            }
        }
        return newState;
    }

    case 'ADD_HABIT_PROGRESS': {
        const { habitId, amount } = action.payload;
        let shouldAwardPoints = false;
        let attributeIdToReward = null;
        let newState = { ...state };

        newState.habits = state.habits.map(habit => {
            if (habit.id === habitId) {
                attributeIdToReward = habit.linkedAttribute;
                const today = new Date();
                const lastUpdate = habit.lastProgressDate ? new Date(habit.lastProgressDate) : null;
                const progressBeforeUpdate = isSameDay(today, lastUpdate) ? habit.progress : 0;
                const wasCompleted = progressBeforeUpdate >= habit.target;
                const newProgress = progressBeforeUpdate + amount;
                const isNowCompleted = newProgress >= habit.target;
                let newStreak = habit.streak;
                if (isNowCompleted && !wasCompleted) {
                    shouldAwardPoints = true;
                    newStreak++;
                }
                return { ...habit, progress: newProgress, lastProgressDate: today.toISOString(), streak: newStreak };
            }
            return habit;
        });

        if (shouldAwardPoints) {
            const basePoints = { xp: 115, coins: 8 };
            const attribute = newState.attributes.find(attr => attr.id === attributeIdToReward);
            newState.attributes = newState.attributes.map(attr => {
                if (attr.id === attributeIdToReward) {
                   let newXp = attr.xp + basePoints.xp;
                    let newLevel = attr.level;
                    let xpToNext = attr.xpToNextLevel;
                    while (newXp >= xpToNext) {
                        newXp -= xpToNext;
                        newLevel++;
                        xpToNext = calculateXpToNextLevel(newLevel);
                        newState.leveledUpAttributeId = attr.id;
                        newState.toastInfo = { message: `LEVEL UP! Nível ${newLevel} em ${attr.name.split(' ')[1]}`, icon: partyIcon };
                    }
                    return { ...attr, xp: newXp, level: newLevel, xpToNextLevel: xpToNext };
                }
                return attr;
            });
            newState.user = { ...newState.user, coins: newState.user.coins + basePoints.coins };
             if (!newState.toastInfo) {
                newState.toastInfo = { message: `Hábito Completo!`, icon: ATTRIBUTE_ICON_MAP[attribute.name.split(' ')[0]] || checkIcon };
            }
        }
        return newState;
    }

    case 'TOGGLE_MILESTONE': {
        const { goalId, milestoneId } = action.payload;
        const goal = state.goals.find(g => g.id === goalId);
        if (!goal) return state;

        const wasCompleted = goal.milestones.find(m => m.id === milestoneId)?.completed;
        let newState = { ...state };

        newState.goals = state.goals.map(g => {
            if (g.id === goalId) {
                const newMilestones = g.milestones.map(ms =>
                    ms.id === milestoneId ? { ...ms, completed: !ms.completed } : ms
                );
                return { ...g, milestones: newMilestones };
            }
            return g;
        });

        if (!wasCompleted) {
            const attributeId = 'attr2'; // Disciplina
            const basePoints = { xp: 125, coins: 15 };
             newState.attributes = newState.attributes.map(attr => {
                if (attr.id === attributeId) {
                   let newXp = attr.xp + basePoints.xp;
                    let newLevel = attr.level;
                    let xpToNext = attr.xpToNextLevel;
                    while (newXp >= xpToNext) {
                        newXp -= xpToNext;
                        newLevel++;
                        xpToNext = calculateXpToNextLevel(newLevel);
                        newState.leveledUpAttributeId = attr.id;
                        newState.toastInfo = { message: `LEVEL UP! Nível ${newLevel} em ${attr.name.split(' ')[1]}`, icon: partyIcon };
                    }
                    return { ...attr, xp: newXp, level: newLevel, xpToNextLevel: xpToNext };
                }
                return attr;
            });
            newState.user = { ...newState.user, coins: newState.user.coins + basePoints.coins };
             if (!newState.toastInfo) {
                newState.toastInfo = { message: 'Marco Conquistado!', icon: flagIcon };
            }
        }
        // Lógica de completar a meta inteira
        const updatedGoal = newState.goals.find(g => g.id === goalId);
        const allMilestonesNowCompleted = updatedGoal.milestones.every(ms => ms.completed);
        if (allMilestonesNowCompleted && updatedGoal.milestones.length > 0) {
            const bonusPoints = { xp: 150, coins: 50 };
            const attributeId = 'attr2'; // Disciplina
             newState.attributes = newState.attributes.map(attr => {
                if (attr.id === attributeId) {
                   let newXp = attr.xp + bonusPoints.xp;
                    let newLevel = attr.level;
                    let xpToNext = attr.xpToNextLevel;
                    while (newXp >= xpToNext) {
                        newXp -= xpToNext;
                        newLevel++;
                        xpToNext = calculateXpToNextLevel(newLevel);
                        newState.leveledUpAttributeId = attr.id; // Animação
                        newState.toastInfo = { message: `LEVEL UP! Nível ${newLevel} em ${attr.name.split(' ')[1]}`, icon: partyIcon };
                    }
                    return { ...attr, xp: newXp, level: newLevel, xpToNextLevel: xpToNext };
                }
                return attr;
            });
            newState.user = { ...newState.user, coins: newState.user.coins + bonusPoints.coins };
            newState.completedGoalInfo = updatedGoal; // Para mostrar celebração
            newState.toastInfo = { message: 'META COMPLETA!', icon: trophyIcon };
        }
        return newState;
    }
    
    case 'ADD_GOAL':
        return { ...state, goals: [...state.goals, action.payload] };
    case 'ADD_HABIT':
        return { ...state, habits: [...state.habits, action.payload] };
    case 'ADD_TASK':
        return { ...state, tasks: [...state.tasks, action.payload] };
    case 'ADD_ATTRIBUTE':
        return { ...state, attributes: [...state.attributes, action.payload] };
    case 'UPDATE_ATTRIBUTE':
        return {
            ...state,
            attributes: state.attributes.map(attr =>
                attr.id === action.payload.id ? { ...attr, name: action.payload.name } : attr
            ),
        };
    case 'DELETE_ATTRIBUTE':
        return {
            ...state,
            attributes: state.attributes.filter(attr => attr.id !== action.payload.id),
        };
    
    // Para limpar os avisos depois de mostrados
    case 'RESET_TOAST':
        return { ...state, toastInfo: null };
    case 'RESET_LEVELUP':
        return { ...state, leveledUpAttributeId: null };
    case 'RESET_COMPLETED_GOAL':
        return { ...state, completedGoalInfo: null };

    default:
      return state;
  }
}

// --- CONTEXTO E PROVEDOR ---
const DataStateContext = createContext();
const DataDispatchContext = createContext();

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, INITIAL_DATA);

  return (
    <DataStateContext.Provider value={state}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataStateContext.Provider>
  );
}

// --- HOOKS CUSTOMIZADOS ---
export function useData() {
  const context = useContext(DataStateContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function useDispatch() {
  const context = useContext(DataDispatchContext);
  if (context === undefined) {
    throw new Error('useDispatch must be used within a DataProvider');
  }
  return context;
}