import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, AlertTriangle } from 'lucide-react';
import './LogoutModal.css';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="logout-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="logout-modal"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="logout-modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>

                    <div className="logout-modal-icon">
                        <AlertTriangle size={48} />
                    </div>

                    <div className="logout-modal-content">
                        <h2 className="logout-modal-title">Confirm Logout</h2>
                        <p className="logout-modal-message">
                            Are you sure you want to log out? Your progress is saved.
                        </p>
                    </div>

                    <div className="logout-modal-actions">
                        <button
                            className="logout-btn logout-btn-cancel"
                            onClick={onClose}
                        >
                            Stay
                        </button>
                        <button
                            className="logout-btn logout-btn-confirm"
                            onClick={onConfirm}
                        >
                            <LogOut size={18} />
                            <span>Log Out</span>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LogoutModal;
