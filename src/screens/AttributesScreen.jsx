// Caminho: src/screens/AttributesScreen.jsx
import React from 'react';
import { useData } from '../context/DataContext';
import ScreenHeader from '../components/ScreenHeader/ScreenHeader';
import AttributeCard from '../components/AttributeCard/AttributeCard';

const AttributesScreen = ({ onAddAttribute, onEditAttribute, onDeleteAttribute }) => {
    const { attributes, leveledUpAttributeId } = useData();

    return (
        <>
            <ScreenHeader title="Seus Atributos" onAdd={onAddAttribute} addLabel="+ Novo Atributo" />
            
            {attributes.length > 0 ? (
                attributes.map(attr => (
                    <AttributeCard 
                        key={attr.id} 
                        attribute={attr}
                        onEdit={onEditAttribute}
                        onDelete={onDeleteAttribute}
                        leveledUp={leveledUpAttributeId === attr.id}
                    />
                ))
            ) : (
                <p style={{ color: '#64748b', textAlign: 'center', marginTop: 32 }}>
                    Crie atributos para personalizar sua jornada.
                </p>
            )}
        </>
    );
};

export default AttributesScreen;