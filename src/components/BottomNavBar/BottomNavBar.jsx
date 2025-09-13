// Caminho: src/components/BottomNavBar/BottomNavBar.jsx
import React from 'react';
import styles from './BottomNavBar.module.css';

const BottomNavBar = ({ activeScreen, setActiveScreen }) => {
    const navItems = [
        { name: 'Home', icon: '🏠' },
        { name: 'Metas', icon: '🚩' },
        { name: 'Hábitos', icon: '🔄' },
        { name: 'Tarefas', icon: '✅' },
          { name: 'Atributos', icon: '👤' },
          { name: 'Config', icon: '⚙️' },
      ];

    return (
        <nav className={styles.navBarContainer}>
            <div className={styles.navBarContent}>
                {navItems.map(item => (
                    <button
                        key={item.name}
                        onClick={() => setActiveScreen(item.name)}
                        className={`${styles.navItem} ${activeScreen === item.name ? styles.active : ''}`}
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        <span className={styles.navText}>{item.name}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNavBar;