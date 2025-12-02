import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Custom hook for managing quiz state and progress
 */
const useQuiz = (quizId) => {
    const [quizState, setQuizState] = useLocalStorage(`quiz_state_${quizId}`, null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [isComplete, setIsComplete] = useState(false);

    // Initialize or restore quiz state
    useEffect(() => {
        if (quizState) {
            setCurrentQuestion(quizState.currentQuestion || 0);
            setAnswers(quizState.answers || []);
            setTimeRemaining(quizState.timeRemaining);
            setIsComplete(quizState.isComplete || false);
        }
    }, [quizState]);

    // Save quiz state to localStorage
    const saveState = useCallback((updates) => {
        setQuizState(prev => ({
            ...prev,
            ...updates,
            lastUpdated: Date.now(),
        }));
    }, [setQuizState]);

    // Answer a question
    const answerQuestion = useCallback((questionId, selectedOption, isCorrect, explanation) => {
        const newAnswer = {
            questionId,
            selectedOption,
            isCorrect,
            explanation,
            answeredAt: Date.now(),
        };

        setAnswers(prev => {
            const updated = [...prev];
            updated[currentQuestion] = newAnswer;
            return updated;
        });

        saveState({
            currentQuestion,
            answers: [...answers, newAnswer],
        });
    }, [currentQuestion, answers, saveState]);

    // Go to next question
    const nextQuestion = useCallback((totalQuestions) => {
        if (currentQuestion < totalQuestions - 1) {
            const next = currentQuestion + 1;
            setCurrentQuestion(next);
            saveState({ currentQuestion: next });
        }
    }, [currentQuestion, saveState]);

    // Go to previous question
    const previousQuestion = useCallback(() => {
        if (currentQuestion > 0) {
            const prev = currentQuestion - 1;
            setCurrentQuestion(prev);
            saveState({ currentQuestion: prev });
        }
    }, [currentQuestion, saveState]);

    // Complete quiz
    const completeQuiz = useCallback(() => {
        setIsComplete(true);
        saveState({ isComplete: true });
    }, [saveState]);

    // Reset quiz
    const resetQuiz = useCallback(() => {
        setCurrentQuestion(0);
        setAnswers([]);
        setTimeRemaining(null);
        setIsComplete(false);
        setQuizState(null);
    }, [setQuizState]);

    // Calculate score
    const calculateScore = useCallback(() => {
        if (answers.length === 0) return 0;
        const correctCount = answers.filter(a => a.isCorrect).length;
        return Math.round((correctCount / answers.length) * 100);
    }, [answers]);

    // Timer management for timed quizzes
    const startTimer = useCallback((duration) => {
        setTimeRemaining(duration);
        saveState({ timeRemaining: duration, startedAt: Date.now() });
    }, [saveState]);

    const updateTimer = useCallback((seconds) => {
        setTimeRemaining(seconds);
        saveState({ timeRemaining: seconds });
    }, [saveState]);

    return {
        currentQuestion,
        answers,
        timeRemaining,
        isComplete,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        completeQuiz,
        resetQuiz,
        calculateScore,
        startTimer,
        updateTimer,
        progress: {
            current: currentQuestion + 1,
            total: answers.length,
            percentage: answers.length > 0 ? Math.round(((currentQuestion + 1) / answers.length) * 100) : 0,
        },
    };
};

export default useQuiz;
