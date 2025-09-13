// Caminho: src/screens/HabitsScreen.jsx
import React from 'react';
import { useData } from '../context/DataContext';
import ScreenHeader from '../components/ScreenHeader/ScreenHeader';
import HabitItem from '../components/HabitItem/HabitItem';

const HabitsScreen = ({ onAddHabit, onOpenActionMenu }) => {
    const { habits } = useData();

    return (
        <>
            <ScreenHeader title="Seus Hábitos" onAdd={onAddHabit} addLabel="+ Novo Hábito" />

            {habits.length > 0 ? (
                habits.map(habit => (
                    <HabitItem key={habit.id} habit={habit} onOpenActionMenu={onOpenActionMenu} />
                ))
            ) : (
                <p style={{ color: '#64748b', textAlign: 'center', marginTop: 32 }}>
                    Crie um hábito para fortalecer seus atributos.
                </p>
            )}
        </>
    );
};

export default HabitsScreen;