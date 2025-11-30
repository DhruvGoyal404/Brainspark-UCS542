import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './Modal.css';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnBackdropClick = true,
    closeOnEsc = true
}) => {
    useEffect(() => {
        if (!isOpen) return;

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Handle ESC key
        const handleEsc = (e) => {
            if (closeOnEsc && e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose, closeOnEsc]);

    const handleBackdropClick = (e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: -20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: -20,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <motion.div
                        className="modal-backdrop"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={handleBackdropClick}
                    >
                        <motion.div
                            className={`modal-content modal-${size}`}
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="modal-header">
                                {title && (
                                    <h2 id="modal-title" className="modal-title">
                                        {title}
                                    </h2>
                                )}
                                {showCloseButton && (
                                    <button
                                        className="modal-close-button"
                                        onClick={onClose}
                                        aria-label="Close modal"
                                    >
                                        <X size={24} />
                                    </button>
                                )}
                            </div>

                            {/* Body */}
                            <div className="modal-body">
                                {children}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
