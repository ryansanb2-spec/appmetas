// Caminho: src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useData, useDispatch } from './context/DataContext';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import GoalsScreen from './screens/GoalsScreen';
import HabitsScreen from './screens/HabitsScreen';
import TasksScreen from './screens/TasksScreen';
import AttributesScreen from './screens/AttributesScreen';
import SettingsScreen from './screens/SettingsScreen';

// Import Components
import Header from './components/Header/Header';
import BottomNavBar from './components/BottomNavBar/BottomNavBar';
import Modal from './components/Modal/Modal';
import Toast from './components/Toast/Toast';
import { AddGoalModal, AddHabitModal, AddTaskModal, AddAttributeModal, EditAttributeModal, DeleteAttributeModal } from './components/Modal/ModalContent';
import HabitActionMenu from './components/HabitActionMenu/HabitActionMenu';
import GoalCompletionCelebration from './components/GoalCompletionCelebration/GoalCompletionCelebration';

export default function App() {
    const [activeScreen, setActiveScreen] = useState('Home');
    const [modal, setModal] = useState({ isOpen: false, type: null, data: null });
    const [habitActionMenu, setHabitActionMenu] = useState({ isOpen: false, habit: null });
    const [toasts, setToasts] = useState([]);

    const data = useData();
    const dispatch = useDispatch();

    const addToast = useCallback((message, icon) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, icon }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    }, []);

    // Efeito para mostrar toasts vindos do reducer
    useEffect(() => {
        if (data.toastInfo) {
            addToast(data.toastInfo.message, data.toastInfo.icon);
            dispatch({ type: 'RESET_TOAST' });
        }
    }, [data.toastInfo, addToast, dispatch]);
    
    const onOpenModal = (type, data = null) => setModal({ isOpen: true, type, data });
    const onCloseModal = () => setModal({ isOpen: false, type: null, data: null });

    const renderScreen = () => {
        switch (activeScreen) {
            case 'Home':
                return <HomeScreen setActiveScreen={setActiveScreen} setHabitActionMenu={setHabitActionMenu} />;
            case 'Metas':
                return <GoalsScreen onAddGoal={() => onOpenModal('addGoal')} />;
            case 'Hábitos':
                return <HabitsScreen onAddHabit={() => onOpenModal('addHabit')} onOpenActionMenu={(habit) => setHabitActionMenu({ isOpen: true, habit })} />;
            case 'Tarefas':
                return <TasksScreen onAddTask={() => onOpenModal('addTask')} />;
            case 'Atributos':
                return <AttributesScreen onAddAttribute={() => onOpenModal('addAttribute')} onEditAttribute={(attr) => onOpenModal('editAttribute', attr)} onDeleteAttribute={(attr) => onOpenModal('deleteAttribute', attr)} />;
            case 'Config':
                return <SettingsScreen />;
            default:
                return <HomeScreen setActiveScreen={setActiveScreen} setHabitActionMenu={setHabitActionMenu} />;
        }
    };
    
    const renderModalContent = () => {
        switch(modal.type) {
            case 'addGoal':
                return <AddGoalModal onClose={onCloseModal} />;
            case 'addHabit':
                return <AddHabitModal onClose={onCloseModal} />;
            case 'addTask':
                return <AddTaskModal onClose={onCloseModal} />;
            case 'addAttribute':
                return <AddAttributeModal onClose={onCloseModal} />;
            case 'editAttribute':
                return <EditAttributeModal data={modal.data} onClose={onCloseModal} />;
            case 'deleteAttribute':
                return <DeleteAttributeModal data={modal.data} onClose={onCloseModal} />;
            default:
                return null;
        }
    };

    return (
        <main className="safeArea">
            <div className="appContainer">
                <Header />
                <div className="contentArea">
                    <div className="screenScrollView">
                        {renderScreen()}
                    </div>
                </div>

                <div className="toast-container">
                    {toasts.map(toast => <Toast key={toast.id} {...toast} />)}
                </div>

                <BottomNavBar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

                {modal.isOpen && <Modal onClose={onCloseModal}>{renderModalContent()}</Modal>}
                
                {habitActionMenu.isOpen && 
                    <HabitActionMenu 
                        habit={habitActionMenu.habit} 
                        onClose={() => setHabitActionMenu({isOpen: false, habit: null})} 
                    />
                }

                {data.completedGoalInfo && 
                    <GoalCompletionCelebration 
                        goal={data.completedGoalInfo} 
                        onClose={() => dispatch({ type: 'RESET_COMPLETED_GOAL' })} 
                    />
                }
            </div>
        </main>
    );
}