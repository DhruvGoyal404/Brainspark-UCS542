import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import Button from './Button';
import './ConfirmationModal.css';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default' // 'default' | 'danger' | 'warning'
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="confirmation-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <motion.div
                        className="confirmation-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="confirmation-title"
                        aria-describedby="confirmation-message"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className="confirmation-header">
                            <div className="confirmation-icon-wrapper">
                                <div className={`confirmation-icon confirmation-icon-${variant}`}>
                                    <AlertCircle size={24} />
                                </div>
                            </div>
                            <button
                                className="confirmation-close"
                                onClick={onClose}
                                aria-label="Close confirmation"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="confirmation-content">
                            <h2 id="confirmation-title" className="confirmation-title">
                                {title}
                            </h2>
                            <p id="confirmation-message" className="confirmation-message">
                                {message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="confirmation-actions">
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                fullWidth
                            >
                                {cancelText}
                            </Button>
                            <Button
                                variant={variant === 'danger' ? 'danger' : 'primary'}
                                onClick={handleConfirm}
                                fullWidth
                            >
                                {confirmText}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
