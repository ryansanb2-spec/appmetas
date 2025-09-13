// Caminho: src/components/AttributeCard/AttributeCard.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './AttributeCard.module.css';

const AttributeCard = ({ attribute, onEdit, onDelete, leveledUp }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const xpPercentage = Math.min((attribute.xp / attribute.xpToNextLevel) * 100, 100);

    // Lógica para fechar o menu ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    return (
        <div className={`${styles.attributeCardContainer} ${leveledUp ? styles.levelUp : ''}`}>
            <div className={styles.attributeCardHeader}>
                <span className={styles.attributeCardName}>{attribute.name}</span>
                <div ref={menuRef} style={{ position: 'relative' }}>
                    <button onClick={() => setMenuOpen(!menuOpen)} className={styles.attributeMenuButton}>...</button>
                    {menuOpen && (
                        <div className={styles.attributeMenu}>
                            <button onClick={() => { onEdit(attribute); setMenuOpen(false); }} className={styles.attributeMenuItem}>✏️ Editar</button>
                            <button onClick={() => { onDelete(attribute); setMenuOpen(false); }} className={`${styles.attributeMenuItem} ${styles.deleteOption}`}>🗑️ Excluir</button>
                        </div>
                    )}
                </div>
            </div>
            <span className={`${styles.attributeCardLevel} ${leveledUp ? styles.attributeCardLevelUp : ''}`}>
                Nível {attribute.level}
            </span>
            <div className={styles.progressBarBg}>
                <div className={styles.progressBarFg} style={{ width: `${xpPercentage}%` }} />
            </div>
            <p className={styles.attributeCardXpText}>{attribute.xp} / {attribute.xpToNextLevel} XP</p>
        </div>
    );
};

export default AttributeCard;