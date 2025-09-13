// Caminho: src/screens/HomeScreen.jsx
import React from 'react';
import { useData } from '../context/DataContext';
import HabitItem from '../components/HabitItem/HabitItem';
import TaskItem from '../components/TaskItem/TaskItem';
import styles from './HomeScreen.module.css';
import mascot from '../assets/mascot.svg';

// Helper para verificar se a data de um hábito é hoje
const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

const HomeScreen = ({ setActiveScreen, setHabitActionMenu }) => {
    const { goals, habits, tasks } = useData();

    const today = new Date();
    const pendingTasks = tasks.filter(t => !t.completed);
    const pendingHabits = habits.filter(h => h.progress < h.target || !isSameDay(h.lastProgressDate, today));

    const hasNoContent = goals.length === 0 && habits.length === 0 && tasks.length === 0;
    const allDoneForToday = pendingTasks.length === 0 && pendingHabits.length === 0;

    if (hasNoContent) {
        return (
            <div className={styles.emptyStateContainer}>
                <img src={mascot} alt="Mascote" className={styles.emptyStateImage} />
                <h2 className={styles.emptyStateTitle}>Parece vazio por aqui!</h2>
                <p className={styles.emptyStateText}>Sua jornada começa agora. Que tal dar o primeiro passo?</p>
                <div className={styles.launchpadContainer}>
                    <button className={styles.launchpadButton} onClick={() => setActiveScreen('Metas')}>
                        <span className={styles.launchpadIcon}>🚩</span>
                        <div>
                            <p className={styles.launchpadTitle}>Criar uma Nova Meta</p>
                            <p className={styles.launchpadText}>Defina seus grandes objetivos.</p>
                        </div>
                    </button>
                    <button className={styles.launchpadButton} onClick={() => setActiveScreen('Hábitos')}>
                        <span className={styles.launchpadIcon}>🔄</span>
                        <div>
                            <p className={styles.launchpadTitle}>Formar um Novo Hábito</p>
                            <p className={styles.launchpadText}>Construa a consistência diária.</p>
                        </div>
                    </button>
                    <button className={styles.launchpadButton} onClick={() => setActiveScreen('Tarefas')}>
                        <span className={styles.launchpadIcon}>✅</span>
                        <div>
                            <p className={styles.launchpadTitle}>Adicionar Tarefa Rápida</p>
                            <p className={styles.launchpadText}>Para as missões do dia a dia.</p>
                        </div>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {pendingTasks.length > 0 && (
                <section className={styles.sectionContainer}>
                    <h2 className={styles.sectionTitle}>Missões do Dia</h2>
                    {pendingTasks.map(task => <TaskItem key={task.id} task={task} />)}
                </section>
            )}

            {pendingHabits.length > 0 && (
                 <section className={styles.sectionContainer}>
                    <h2 className={styles.sectionTitle}>Hábitos para Upar</h2>
                    {pendingHabits.map(habit => <HabitItem key={habit.id} habit={habit} onOpenActionMenu={(h) => setHabitActionMenu({isOpen: true, habit: h})} />)}
                </section>
            )}

            {allDoneForToday && !hasNoContent && (
                <div className={styles.allDoneContainer}>
                    <p className={styles.allDoneEmoji}>🎉</p>
                    <h2 className={styles.allDoneTitle}>Tudo certo por hoje!</h2>
                    <p className={styles.allDoneText}>Você completou tudo. Descanse ou planeje seu próximo dia!</p>
                </div>
            )}
        </>
    );
};

export default HomeScreen;