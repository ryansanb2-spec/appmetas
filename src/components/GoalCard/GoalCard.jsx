// Caminho: src/components/GoalCard/GoalCard.jsx
import React, { useState } from 'react';
import { useDispatch, useData } from '../../context/DataContext';
import TaskItem from '../TaskItem/TaskItem';
import styles from './GoalCard.module.css';

const GoalCard = ({ goal }) => {
    const [expandedMilestone, setExpandedMilestone] = useState(null);
    const { tasks } = useData();
    const dispatch = useDispatch();

    const progress = goal.milestones.reduce((acc, ms) => acc + (ms.completed ? (ms.weight || 0) : 0), 0);

    const today = new Date().setHours(0, 0, 0, 0);
    const endDate = goal.endDate ? new Date(goal.endDate).setHours(0, 0, 0, 0) : null;
    const isOverdue = endDate && (endDate < today);

    const toggleMilestoneExpansion = (milestoneId) => {
        setExpandedMilestone(prev => (prev === milestoneId ? null : milestoneId));
    };

    const handleToggleMilestone = (goalId, milestoneId) => {
        dispatch({ type: 'TOGGLE_MILESTONE', payload: { goalId, milestoneId } });
    };

    return (
        <div className={styles.goalCardContainer}>
            {/* Header do Card */}
            <div className={styles.goalHeader}>
                <div className={styles.goalTitleContainer}>
                    <span className={styles.goalEmoji}>{goal.emoji || '🎯'}</span>
                    <div>
                        <h3 className={styles.goalTitle}>{goal.title}</h3>
                        {goal.startDate && <p className={styles.goalStartDate}>Início: {new Date(goal.startDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>}
                    </div>
                </div>
                {goal.endDate && (
                    <span className={`${styles.deadlineTag} ${isOverdue ? styles.overdueTag : ''}`}>
                        Prazo: {new Date(goal.endDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </span>
                )}
            </div>

            {/* "Porquê" e Barra de Progresso */}
            {goal.why && <p className={styles.goalWhy}><b>Meu porquê:</b> "{goal.why}"</p>}
            <div className={styles.goalProgressBarBg}>
                <div className={styles.goalProgressBarFg} style={{ width: `${progress}%` }} />
            </div>

            {/* Marcos (Milestones) */}
            <div className={styles.goalMilestonesScrollContainer}>
                {goal.milestones.map((ms) => {
                    const linkedTasks = tasks.filter(t => t.linkedMilestone === ms.id && !t.completed);
                    const isExpanded = expandedMilestone === ms.id;
                    return (
                        <div key={ms.id} className={styles.milestoneWrapper}>
                             <button onClick={() => toggleMilestoneExpansion(ms.id)} className={styles.milestone}>
                                <p className={`${styles.milestoneIcon} ${ms.completed ? styles.completedIcon : ''} ${isExpanded ? styles.expandedIcon : ''}`}>🚩</p>
                                <span className={`${styles.milestoneName} ${ms.completed && styles.milestoneNameCompleted}`}>{ms.name}</span>
                                {linkedTasks.length > 0 && !ms.completed &&
                                    <span className={styles.milestoneActionCount}>{linkedTasks.length}</span>
                                }
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Detalhes do Marco Expandido */}
            {expandedMilestone && (
                <div className={styles.milestoneExpansion}>
                    <h4 className={styles.expansionTitle}>
                        Ações para "{goal.milestones.find(m => m.id === expandedMilestone).name}"
                    </h4>
                    {tasks.filter(t => t.linkedMilestone === expandedMilestone).length > 0 ?
                        tasks.filter(t => t.linkedMilestone === expandedMilestone).map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))
                        : <p className={styles.noTasksText}>Nenhuma tarefa vinculada a este marco.</p>
                    }
                    <button
                        onClick={() => handleToggleMilestone(goal.id, expandedMilestone)}
                        className={styles.markMilestoneButton}
                    >
                        {goal.milestones.find(m => m.id === expandedMilestone).completed ? 'Desmarcar Marco' : 'Marcar Marco como Concluído'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default GoalCard;