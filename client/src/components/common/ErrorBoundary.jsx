import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from '../ui/Button';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-boundary-container">
                        <div className="error-icon">
                            <AlertTriangle size={64} />
                        </div>

                        <h1 className="error-boundary-title">Oops! Something went wrong</h1>

                        <p className="error-boundary-message">
                            We're sorry for the inconvenience. An unexpected error occurred.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="error-details">
                                <summary>Error Details (Development Only)</summary>
                                <pre className="error-stack">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="error-boundary-actions">
                            <Button
                                variant="primary"
                                size="lg"
                                icon={<RefreshCw size={20} />}
                                onClick={this.handleReset}
                            >
                                Try Again
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                icon={<Home size={20} />}
                                onClick={this.handleGoHome}
                            >
                                Go to Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
