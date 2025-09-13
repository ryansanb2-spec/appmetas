// Caminho: src/screens/SettingsScreen.jsx
import React from 'react';
import { useData, useDispatch } from '../context/DataContext';

const SettingsScreen = () => {
  const { soundEnabled } = useData();
  const dispatch = useDispatch();

  return (
    <div style={{ padding: '16px' }}>
      <h2>Configurações</h2>
      <label>
        <input
          type="checkbox"
          checked={soundEnabled}
          onChange={() => dispatch({ type: 'TOGGLE_SOUND' })}
        />
        Sons
      </label>
    </div>
  );
};

export default SettingsScreen;
