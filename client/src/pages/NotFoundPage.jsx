import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import './NotFoundPage.css';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="not-found-container">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="not-found-content"
                >
                    <div className="error-code">404</div>
                    <h1 className="error-title">Page Not Found</h1>
                    <p className="error-message">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>

                    <div className="error-actions">
                        <Button
                            variant="primary"
                            size="lg"
                            icon={<Home size={20} />}
                            onClick={() => navigate('/')}
                        >
                            Go to Home
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            icon={<ArrowLeft size={20} />}
                            onClick={() => navigate(-1)}
                        >
                            Go Back
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="error-illustration"
                >
                    <div className="floating-elements">
                        <div className="float-element">?</div>
                        <div className="float-element">!</div>
                        <div className="float-element">📚</div>
                        <div className="float-element">🎯</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFoundPage;
