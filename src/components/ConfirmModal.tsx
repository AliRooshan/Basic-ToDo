import React from 'react';

import './ConfirmModal.css';

interface ConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    title,
    message
}) => {
    return (
        <>
            {isOpen && (
                <>
                    <div
                        className="confirm-backdrop"
                        onClick={onCancel}
                    />
                    <div className="confirm-container">
                        <h3 className="confirm-title">{title}</h3>
                        <p className="confirm-message">{message}</p>

                        <div className="confirm-actions">
                            <button
                                className="cancel-btn"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirm-btn"
                                onClick={onConfirm}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ConfirmModal;
