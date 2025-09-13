// Caminho: src/components/TaskItem/TaskItem.jsx
import React, { useState } from 'react';
import { useDispatch } from '../../context/DataContext';
import styles from './TaskItem.module.css';

const TaskItem = ({ task }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useDispatch();

    // Função que despacha a ação para completar a tarefa
    const handleCompleteTask = () => {
        if (!task.completed) {
            dispatch({ 
                type: 'COMPLETE_TASK', 
                payload: { taskId: task.id, attributeId: task.linkedAttribute } 
            });
        }
    };
    
    // Função que despacha a ação para marcar/desmarcar uma subtarefa
    const handleToggleSubtask = (e, subtaskId) => {
        e.stopPropagation(); // Impede que o clique na subtarefa acione o clique da tarefa principal
        dispatch({ type: 'TOGGLE_SUBTASK', payload: { taskId: task.id, subtaskId } });
    };

    const handleMainClick = () => {
        if (task.subtasks && task.subtasks.length > 0) {
            setIsExpanded(prev => !prev);
        } else {
            handleCompleteTask();
        }
    };
    
    const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;
    const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return (
        <div className={`${styles.taskItemBase} ${task.completed ? styles.taskItemCompleted : ''}`}>
            <div className={styles.mainContent} onClick={handleMainClick}>
                <div className={`${styles.taskCheckbox} ${task.completed && styles.taskCheckboxCompleted}`}>
                    {task.completed && <span className={styles.taskCheck}>✓</span>}
                </div>
                <div className={styles.taskTextContainer}>
                    <p className={`${styles.taskText} ${task.completed && styles.taskTextCompleted}`}>{task.text}</p>
                    <div className={styles.taskDetails}>
                        <span className={styles.taskPriority}>P{task.priority}</span>
                        {task.endDate && <span className={styles.taskInfo}>📅 {new Date(task.endDate).toLocaleDateString()}</span>}
                        <span className={styles.taskInfo}>{'⚡️'.repeat(task.energy)}</span>
                        {totalSubtasks > 0 && 
                            <span className={styles.taskInfo}>📋 {completedSubtasks}/{totalSubtasks}</span>
                        }
                    </div>
                </div>
                {totalSubtasks > 0 && <span className={styles.taskCaret} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'}}>▶</span>}
            </div>

            {isExpanded && totalSubtasks > 0 && (
                <div className={styles.subtaskContainer}>
                    {task.subtasks.map(subtask => (
                        <div key={subtask.id} onClick={(e) => handleToggleSubtask(e, subtask.id)} className={styles.subtaskItem}>
                            <div className={`${styles.subtaskCheckbox} ${subtask.completed && styles.taskCheckboxCompleted}`}>
                              {subtask.completed && <span className={styles.subtaskCheck}>✓</span>}
                            </div>
                            <span className={`${styles.subtaskText} ${subtask.completed && styles.subtaskTextCompleted}`}>{subtask.text}</span>
                        </div>
                    ))}
                </div>
            )}
            {totalSubtasks > 0 && !task.completed &&
                <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFg} style={{width: `${progressPercentage}%`}}/>
                </div>
            }
        </div>
    );
};

export default TaskItem;