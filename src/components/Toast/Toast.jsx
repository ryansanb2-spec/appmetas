// Caminho do arquivo: src/components/Toast/Toast.jsx

import React from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, icon }) => {
    return (
        <div className={styles.toastItem}>
            <span className={styles.toastIcon}>{icon}</span>
            <span className={styles.toastMessage}>{message}</span>
        </div>
    );
};

export default Toast;