// Caminho: src/screens/TasksScreen.jsx
import React from 'react';
import { useData } from '../context/DataContext';
import ScreenHeader from '../components/ScreenHeader/ScreenHeader';
import TaskItem from '../components/TaskItem/TaskItem';

const TasksScreen = ({ onAddTask }) => {
    const { tasks } = useData();

    // Opcional: separar tarefas pendentes e concluídas
    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    return (
        <>
            <ScreenHeader title="Tarefas" onAdd={onAddTask} addLabel="+ Nova Tarefa" />

            {tasks.length > 0 ? (
                <>
                    {/* Mostra primeiro as pendentes */}
                    {pendingTasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                    
                    {/* Depois mostra as concluídas */}
                    {completedTasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </>
            ) : (
                <p style={{ color: '#64748b', textAlign: 'center', marginTop: 32 }}>
                    Nenhuma tarefa por aqui. Adicione uma!
                </p>
            )}
        </>
    );
};

export default TasksScreen;