// Caminho do arquivo: src/components/Header/Header.jsx

import React from 'react';
import { useData } from '../../context/DataContext';
import styles from './Header.module.css';

const Header = () => {
    // Pega o usuário direto do contexto! Sem precisar de props.
    const { user } = useData(); 

    return (
        <header className={styles.headerContainer}>
            <div>
                <h1 className={styles.headerTitle}>Olá, {user.name}!</h1>
                <p className={styles.headerSubtitle}>Pronto para sua quest de hoje?</p>
            </div>
            <div className={styles.headerStatsContainer}>
                <div className={styles.headerStatChip}>
                    <span className={styles.headerStatIcon}>💰</span>
                    <span className={styles.headerStatTextCoins}>{user.coins}</span>
                </div>
                <div className={`${styles.headerStatChip} ${styles.freezeChip}`}>
                    <span className={styles.headerStatIcon}>❄️</span>
                    <span className={styles.headerStatTextTokens}>{user.freezeTokens}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;