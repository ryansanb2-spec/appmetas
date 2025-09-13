// Caminho: src/screens/GoalsScreen.jsx
import React from 'react';
import { useData } from '../context/DataContext';
import ScreenHeader from '../components/ScreenHeader/ScreenHeader';
import GoalCard from '../components/GoalCard/GoalCard';

const GoalsScreen = ({ onAddGoal }) => {
    const { goals } = useData();

    return (
        <>
            <ScreenHeader title="Suas Metas" onAdd={onAddGoal} addLabel="+ Nova Meta" />
            
            {goals.length > 0 ? (
                goals.map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                ))
            ) : (
                <p style={{ color: '#64748b', textAlign: 'center', marginTop: 32 }}>
                    Crie sua primeira grande meta!
                </p>
            )}
        </>
    );
};

export default GoalsScreen;