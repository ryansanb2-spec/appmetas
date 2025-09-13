// Caminho: src/components/GoalCompletionCelebration/GoalCompletionCelebration.jsx
import React from 'react';
import styles from './GoalCompletionCelebration.module.css';

// Um componente simples para o efeito de confete
const Confetti = () => {
    const confettiElements = Array.from({ length: 100 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`,
            backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'][Math.floor(Math.random() * 6)],
        };
        return <div key={i} className={styles.confetti} style={style} />;
    });
    return <div className={styles.confettiContainer}>{confettiElements}</div>;
};

const GoalCompletionCelebration = ({ goal, onClose }) => (
    <div className={styles.modalBackdrop}>
        <Confetti />
        <div className={styles.modalContent}>
            <h2 className={styles.title}>🎉 PARABÉNS! 🎉</h2>
            <p className={styles.subtitle}>Você completou a meta:</p>
            <p className={styles.goalTitle}>"{goal.title}"</p>
            <p className={styles.rewardsLabel}>Recompensas:</p>
            <div className={styles.rewardsContainer}>
                <span className={styles.rewardChip}>+150 XP</span>
                <span className={styles.rewardChip}>+50 💰</span>
            </div>
            <button onClick={onClose} className={styles.continueButton}>Continuar Jornada</button>
        </div>
    </div>
);

export default GoalCompletionCelebration;