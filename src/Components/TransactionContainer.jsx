import React, { useState } from 'react';
import TransactionDetailsModule from './TransactionDetailsModule';
import TransactionEdit from './TransactionEdit';  // Импорт компонента редактирования

function TransactionContainer({ transaction, onClose }) {
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = (transaction) => {
        setIsEditing(true);  // Переключаемся в режим редактирования
    };

    const handleCancelEdit = () => {
        setIsEditing(false);  // Возвращаемся к режиму отображения деталей
    };

    const handleSaveEdit = (updatedTransaction) => {
        // Здесь должна быть логика сохранения изменений (например, обновление данных через Firestore)
        console.log('Updated transaction: ', updatedTransaction);
        setIsEditing(false);  // После сохранения возвращаемся в режим отображения деталей
    };

    return (
        <>
            {isEditing ? (
                <TransactionEdit
                    transaction={transaction}
                    onCancel={handleCancelEdit}
                    onSave={handleSaveEdit}
                />
            ) : (
                <TransactionDetailsModule
                    transaction={transaction}
                    onClose={onClose}
                    onEdit={handleEdit}
                />
            )}
        </>
    );
}

export default TransactionContainer;
