// Caminho: src/components/Modal/ModalContent.jsx
import React, { useState } from 'react';
import { useDispatch, useData } from '../../context/DataContext';
import styles from './Modal.module.css'; // Usaremos o mesmo CSS do Modal

// --- COMPONENTE PARA ADICIONAR META ---
export const AddGoalModal = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const dispatch = useDispatch();
    const [newGoal, setNewGoal] = useState({ title: '', emoji: '🎯', why: '', milestones: [''], startDate: '', endDate: '' });

    const handleMilestoneChange = (index, value) => {
        const updatedMilestones = [...newGoal.milestones];
        updatedMilestones[index] = value;
        setNewGoal({ ...newGoal, milestones: updatedMilestones });
    };

    const addMilestoneInput = () => setNewGoal({ ...newGoal, milestones: [...newGoal.milestones, ''] });
    const removeMilestoneInput = (index) => {
        if (newGoal.milestones.length > 1) {
            setNewGoal({ ...newGoal, milestones: newGoal.milestones.filter((_, i) => i !== index) });
        }
    };

    const handleSaveGoal = () => {
        const finalMilestones = newGoal.milestones
            .map(name => name.trim())
            .filter(name => name !== '');
            
        if (!newGoal.title || finalMilestones.length === 0 || !newGoal.why) {
            alert("Preencha o título, o 'porquê' e pelo menos um marco!");
            return;
        }

        const goalToAdd = {
            id: `goal_${Date.now()}`,
            ...newGoal,
            startDate: newGoal.startDate || new Date().toISOString().split('T')[0],
            milestones: finalMilestones.map((name, index) => ({
                id: `ms_${Date.now()}_${index}`,
                name: name,
                weight: Math.round(100 / finalMilestones.length),
                completed: false,
            })),
        };
        dispatch({ type: 'ADD_GOAL', payload: goalToAdd });
        onClose();
    };

    return (
        <div>
            <h3 className={styles.modalTitle}>Criar Nova Meta</h3>
            {step === 1 && (
                <div>
                    <p className={styles.modalStepTitle}>Passo 1: O Quê?</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <input type="text" value={newGoal.emoji} onChange={(e) => setNewGoal({ ...newGoal, emoji: e.target.value })} className={styles.emojiInput} maxLength="2" />
                        <input type="text" placeholder="Nome da sua meta" className={styles.modalInput} value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} />
                    </div>
                    <div className={styles.dateContainer}>
                        <div>
                            <label className={styles.modalLabel}>Início (opcional):</label>
                            <input type="date" className={styles.modalInput} value={newGoal.startDate} onChange={e => setNewGoal({ ...newGoal, startDate: e.target.value })} />
                        </div>
                        <div>
                            <label className={styles.modalLabel}>Prazo (opcional):</label>
                            <input type="date" className={styles.modalInput} value={newGoal.endDate} onChange={e => setNewGoal({ ...newGoal, endDate: e.target.value })} />
                        </div>
                    </div>
                    <button onClick={() => setStep(2)} className={`${styles.primaryButton} ${styles.fullWidth}`}>Próximo</button>
                </div>
            )}
            {step === 2 && (
                <div>
                    <p className={styles.modalStepTitle}>Passo 2: O Porquê?</p>
                    <label className={styles.modalLabel}>Por que essa meta é importante para você?</label>
                    <textarea placeholder="Isso vai te manter motivado nos dias difíceis..." className={styles.modalTextarea} value={newGoal.why} onChange={(e) => setNewGoal({ ...newGoal, why: e.target.value })} />
                    <div className={styles.buttonGroup}>
                        <button onClick={() => setStep(1)} className={styles.secondaryButton}>Voltar</button>
                        <button onClick={() => setStep(3)} className={styles.primaryButton}>Próximo</button>
                    </div>
                </div>
            )}
            {step === 3 && (
                <div>
                    <p className={styles.modalStepTitle}>Passo 3: O Como?</p>
                    <label className={styles.modalLabel}>Quais são os marcos para chegar lá?</label>
                    <div className={styles.inputList}>
                        {newGoal.milestones.map((ms, index) => (
                            <div key={index} className={styles.inputListItem}>
                                <input type="text" placeholder={`Marco ${index + 1}`} className={styles.modalInput} value={ms} onChange={(e) => handleMilestoneChange(index, e.target.value)} />
                                <button onClick={() => removeMilestoneInput(index)} className={styles.removeButton} disabled={newGoal.milestones.length <= 1}>-</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={addMilestoneInput} className={styles.addButton}>+ Adicionar Marco</button>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => setStep(2)} className={styles.secondaryButton}>Voltar</button>
                        <button onClick={handleSaveGoal} className={styles.primaryButton}>Salvar Meta</button>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- COMPONENTE PARA ADICIONAR HÁBITO ---
export const AddHabitModal = ({ onClose }) => {
    const { attributes } = useData();
    const dispatch = useDispatch();
    const [newHabit, setNewHabit] = useState({
        cue: '',
        action: '',
        attribute: attributes[0]?.id || '',
        target: '10',
        unit: 'minutos',
        startDate: new Date().toISOString().split('T')[0],
    });

    const handleSaveHabit = () => {
        if (!newHabit.cue || !newHabit.action || !newHabit.target) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        const habitToAdd = {
            id: `habit_${Date.now()}`,
            name: newHabit.action,
            cue: newHabit.cue,
            linkedAttribute: newHabit.attribute,
            target: parseInt(newHabit.target),
            unit: newHabit.unit,
            progress: 0,
            startDate: newHabit.startDate,
            streak: 0,
            lastProgressDate: null,
        };
        
        dispatch({ type: 'ADD_HABIT', payload: habitToAdd });
        onClose();
    };

    return (
         <div>
            <h3 className={styles.modalTitle}>Criar Novo Hábito</h3>
            <label className={styles.modalLabel}>Gatilho (Quando/Onde?)</label>
            <input type="text" placeholder="Ex: Depois do café da manhã" className={styles.modalInput} value={newHabit.cue} onChange={e => setNewHabit({ ...newHabit, cue: e.target.value })} />
            
            <label className={styles.modalLabel}>Ação (O que você vai fazer?)</label>
            <input type="text" placeholder="Ex: Meditar" className={styles.modalInput} value={newHabit.action} onChange={e => setNewHabit({ ...newHabit, action: e.target.value })} />

            <div className={styles.dateContainer}>
                <div>
                    <label className={styles.modalLabel}>Quantidade</label>
                    <input type="number" className={styles.modalInput} value={newHabit.target} onChange={e => setNewHabit({ ...newHabit, target: e.target.value })} />
                </div>
                <div>
                    <label className={styles.modalLabel}>Unidade</label>
                    <select className={styles.modalInput} value={newHabit.unit} onChange={e => setNewHabit({ ...newHabit, unit: e.target.value })}>
                        <option value="minutos">minutos</option>
                        <option value="páginas">páginas</option>
                        <option value="horas">horas</option>
                        <option value="vezes">vezes</option>
                    </select>
                </div>
            </div>

            <label className={styles.modalLabel}>Qual atributo este hábito vai upar?</label>
            <select className={styles.modalInput} value={newHabit.attribute} onChange={e => setNewHabit({ ...newHabit, attribute: e.target.value })}>
                {attributes.map(attr => <option key={attr.id} value={attr.id}>{attr.name}</option>)}
            </select>

             <label className={styles.modalLabel}>Data de Início</label>
             <input type="date" className={styles.modalInput} value={newHabit.startDate} onChange={e => setNewHabit({ ...newHabit, startDate: e.target.value })} />

            <div className={styles.buttonGroup}>
                <button onClick={onClose} className={styles.secondaryButton}>Cancelar</button>
                <button onClick={handleSaveHabit} className={styles.primaryButton}>Salvar Hábito</button>
            </div>
        </div>
    );
};


// (Os outros modais como AddTask, AddAttribute, etc. seguiriam o mesmo padrão)
// Por enquanto, vamos focar nesses dois para você testar.
export const AddTaskModal = ({ onClose }) => {
    const { attributes } = useData();
    const dispatch = useDispatch();
    const [step, setStep] = useState(1);
    const [taskData, setTaskData] = useState({
        text: '',
        linkedAttribute: attributes[0]?.id || '',
        endDate: '',
        priority: 1,
        energy: 1,
        subtasks: [''],
    });

    const handleSubtaskChange = (index, value) => {
        const updated = [...taskData.subtasks];
        updated[index] = value;
        setTaskData({ ...taskData, subtasks: updated });
    };

    const addSubtask = () => setTaskData({ ...taskData, subtasks: [...taskData.subtasks, ''] });
    const removeSubtask = (index) => {
        if (taskData.subtasks.length > 1) {
            setTaskData({ ...taskData, subtasks: taskData.subtasks.filter((_, i) => i !== index) });
        }
    };

    const handleSaveTask = () => {
        if (!taskData.text.trim()) {
            alert('Descreva a tarefa!');
            return;
        }

        const finalSubtasks = taskData.subtasks
            .map(name => name.trim())
            .filter(name => name !== '')
            .map((text, index) => ({
                id: `st_${Date.now()}_${index}`,
                text,
                completed: false,
            }));

        const taskToAdd = {
            id: `task_${Date.now()}`,
            text: taskData.text.trim(),
            linkedAttribute: taskData.linkedAttribute,
            endDate: taskData.endDate,
            priority: parseInt(taskData.priority, 10) || 1,
            energy: parseInt(taskData.energy, 10) || 1,
            subtasks: finalSubtasks,
            completed: false,
        };

        dispatch({ type: 'ADD_TASK', payload: taskToAdd });
        onClose();
    };

    return (
        <div>
            <h3 className={styles.modalTitle}>Criar Nova Tarefa</h3>

            {step === 1 && (
                <div>
                    <p className={styles.modalStepTitle}>Passo 1: Descrição</p>
                    <label className={styles.modalLabel}>O que precisa ser feito?</label>
                    <input
                        type="text"
                        className={styles.modalInput}
                        placeholder="Descrição da tarefa"
                        value={taskData.text}
                        onChange={e => setTaskData({ ...taskData, text: e.target.value })}
                    />
                    <small>Dica: Comece com um verbo no infinitivo (ex.: 'Ler capítulo 3')</small>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => setStep(2)} className={`${styles.primaryButton} ${styles.fullWidth}`}>Próximo</button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div>
                    <p className={styles.modalStepTitle}>Passo 2: Objetivo/Atributo</p>
                    <label className={styles.modalLabel}>Para qual atributo?</label>
                    <select
                        className={styles.modalInput}
                        value={taskData.linkedAttribute}
                        onChange={e => setTaskData({ ...taskData, linkedAttribute: e.target.value })}
                    >
                        {attributes.map(attr => (
                            <option key={attr.id} value={attr.id}>{attr.name}</option>
                        ))}
                    </select>
                    <small>Vincule a tarefa a um objetivo para aumentar o compromisso</small>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => setStep(1)} className={styles.secondaryButton}>Voltar</button>
                        <button onClick={() => setStep(3)} className={styles.primaryButton}>Próximo</button>
                    </div>
                </div>
            )}

    {step === 3 && (
                <div>
                    <p className={styles.modalStepTitle}>Passo 3: Prazo e Esforço</p>
                    <div className={styles.dateContainer}>
                        <div>
                            <label className={styles.modalLabel}>Prazo</label>
                            <input
                                type="date"
                                className={styles.modalInput}
                                value={taskData.endDate}
                                onChange={e => setTaskData({ ...taskData, endDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={styles.modalLabel}>Prioridade</label>
                            <input
                                type="number"
                                className={styles.modalInput}
                                min="1" max="5"
                                value={taskData.priority}
                                onChange={e => setTaskData({ ...taskData, priority: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={styles.modalLabel}>Energia</label>
                            <input
                                type="number"
                                className={styles.modalInput}
                                min="1" max="5"
                                value={taskData.energy}
                                onChange={e => setTaskData({ ...taskData, energy: e.target.value })}
                            />
                        </div>
                    </div>
                    <small>Datas concretas reduzem procrastinação</small>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => setStep(2)} className={styles.secondaryButton}>Voltar</button>
                        <button onClick={() => setStep(4)} className={styles.primaryButton}>Próximo</button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div>
                    <p className={styles.modalStepTitle}>Passo 4: Subtarefas (opcional)</p>
                    <div className={styles.inputList}>
                        {taskData.subtasks.map((st, index) => (
                            <div key={index} className={styles.inputListItem}>
                                <input
                                    type="text"
                                    placeholder={`Subtarefa ${index + 1}`}
                                    className={styles.modalInput}
                                    value={st}
                                    onChange={e => handleSubtaskChange(index, e.target.value)}
                                />
                                <button
                                    onClick={() => removeSubtask(index)}
                                    className={styles.removeButton}
                                    disabled={taskData.subtasks.length <= 1}
                                >
                                    -
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={addSubtask} className={styles.addButton}>+ Adicionar Subtarefa</button>
                    <small>Divida tarefas complexas em passos simples</small>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => setStep(3)} className={styles.secondaryButton}>Voltar</button>
                        <button onClick={() => setStep(5)} className={styles.primaryButton}>Próximo</button>
                    </div>
                </div>
            )}

            {step === 5 && (
                <div>
                    <p className={styles.modalStepTitle}>Passo 5: Revisão e confirmação</p>
                    <ul>
                        <li><strong>Descrição:</strong> {taskData.text}</li>
                        <li><strong>Atributo:</strong> {attributes.find(a => a.id === taskData.linkedAttribute)?.name}</li>
                        <li><strong>Prazo:</strong> {taskData.endDate ? new Date(taskData.endDate).toLocaleDateString() : 'Sem prazo'}</li>
                        <li><strong>Prioridade:</strong> P{taskData.priority}</li>
                        <li><strong>Energia:</strong> {'⚡️'.repeat(taskData.energy)}</li>
                        {taskData.subtasks.some(st => st.trim()) && (
                            <li>
                                <strong>Subtarefas:</strong>
                                <ul>
                                    {taskData.subtasks.filter(st => st.trim()).map((st, idx) => (
                                        <li key={idx}>{st}</li>
                                    ))}
                                </ul>
                            </li>
                        )}
                    </ul>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => setStep(4)} className={styles.secondaryButton}>Voltar</button>
                        <button onClick={handleSaveTask} className={styles.primaryButton}>Salvar</button>
                    </div>
                </div>
            )}
        </div>
    );
};
export const AddAttributeModal = ({onClose}) => <div>Em breve...</div>;
export const EditAttributeModal = ({onClose}) => <div>Em breve...</div>;
export const DeleteAttributeModal = ({onClose}) => <div>Em breve...</div>;