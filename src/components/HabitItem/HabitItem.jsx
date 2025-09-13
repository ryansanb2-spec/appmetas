// Caminho: src/components/HabitItem/HabitItem.jsx
import React from 'react';
import styles from './HabitItem.module.css';

const HabitItem = ({ habit, onOpenActionMenu }) => {
    const progressPercentage = Math.min((habit.progress / habit.target) * 100, 100);
    const isCompletedToday = progressPercentage >= 100;

    return (
        <div className={`${styles.habitItemContainer} ${isCompletedToday ? styles.itemCompletedGeneric : ''}`}>
            <div className={styles.habitItemMain}>
                 <div>
                    <p className={styles.habitName}>{habit.name}</p>
                    <p className={styles.habitCue}>{habit.cue}</p>
                 </div>
                <button 
                    onClick={() => onOpenActionMenu(habit)}
                    className={`${styles.habitCheckButton} ${isCompletedToday && styles.habitCheckButtonCompleted}`}
                    disabled={isCompletedToday}
                >
                    <span className={styles.habitCheckIcon}>{isCompletedToday ? '✓' : '+'}</span>
                </button>
            </div>
            
            <div className={styles.progressSection}>
                <div className={styles.habitProgressTextContainer}>
                    <span className={styles.habitProgressText}>{habit.progress} / {habit.target} {habit.unit}</span>
                    {isCompletedToday && <span className={styles.habitCompletedTag}>Completo!</span>}
                </div>
                <div className={styles.progressBarBg}>
                    <div 
                        className={styles.progressBarFg} 
                        style={{ width: `${progressPercentage}%`, backgroundColor: isCompletedToday ? '#22c55e' : '#8b5cf6' }} 
                    />
                </div>
            </div>

            {habit.streak > 0 && (
                <div className={styles.habitStreakContainer}>
                    <span className={styles.habitStreakIcon}>🔥</span>
                    <span className={styles.habitStreakText}>{habit.streak} dias de streak!</span>
                </div>
            )}
        </div>
    );
};

export default HabitItem;