// Caminho: src/components/ScreenHeader/ScreenHeader.jsx
import React from 'react';
import styles from './ScreenHeader.module.css';

const ScreenHeader = ({ title, onAdd, addLabel }) => {
    return (
        <div className={styles.screenHeader}>
            <h2 className={styles.screenTitle}>{title}</h2>
            {onAdd && addLabel && (
                <button onClick={onAdd} className={styles.addButton}>
                    {addLabel}
                </button>
            )}
        </div>
    );
};

export default ScreenHeader;