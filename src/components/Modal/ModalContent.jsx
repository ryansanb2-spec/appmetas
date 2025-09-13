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
export const AddTaskModal = ({onClose}) => <div>Em breve...</div>;
export const AddAttributeModal = ({onClose}) => <div>Em breve...</div>;
export const EditAttributeModal = ({onClose}) => <div>Em breve...</div>;
export const DeleteAttributeModal = ({onClose}) => <div>Em breve...</div>;