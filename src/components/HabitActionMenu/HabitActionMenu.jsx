// Caminho: src/components/HabitActionMenu/HabitActionMenu.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from '../../context/DataContext';
import styles from './HabitActionMenu.module.css';

const HabitActionMenu = ({ habit, onClose }) => {
    const [amount, setAmount] = useState('');
    const inputRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        // Foca no input assim que o menu abre
        inputRef.current?.focus();
    }, []);

    const handleAddProgress = (value) => {
        if (!habit || !value || value <= 0) return;
        
        dispatch({
            type: 'ADD_HABIT_PROGRESS',
            payload: { habitId: habit.id, amount: value }
        });
        onClose();
    };

    const handleComplete = () => {
        const remaining = habit.target - habit.progress;
        if (remaining > 0) {
            handleAddProgress(remaining);
        } else {
            onClose();
        }
    };
    
    const handleAddCustom = () => {
        const numericAmount = parseInt(amount, 10);
        if (!isNaN(numericAmount) && numericAmount > 0) {
            handleAddProgress(numericAmount);
        } else {
            onClose();
        }
    };

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.menu} onClick={e => e.stopPropagation()}>
                <h4 className={styles.title}>Registrar Progresso</h4>
                <p className={styles.subtitle}>"{habit.name}"</p>
                <button onClick={handleComplete} className={`${styles.button} ${styles.completeButton}`}>
                    ✅ Completar Meta Diária ({habit.target} {habit.unit})
                </button>
                <div className={styles.inputContainer}>
                    <input
                        ref={inputRef}
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
                        placeholder={`Ex: 5 ${habit.unit}`}
                        className={styles.input}
                    />
                    <button onClick={handleAddCustom} className={`${styles.button} ${styles.addButton}`}>
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HabitActionMenu;