import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const BookmarkContext = createContext();

export const useBookmarkContext = () => {
    const context = useContext(BookmarkContext);
    if (!context) throw new Error('useBookmarkContext must be used within BookmarkProvider');
    return context;
};

/**
 * BookmarkProvider — loads bookmarks ONCE and shares them across the entire tree.
 *
 * Why this matters: previously every component that called useBookmarks() created
 * its own independent API fetch on mount, causing duplicate network requests and
 * inconsistent state between pages.  This context is the single source of truth.
 *
 * Security: isCorrect is stripped from options before storing so the bookmark API
 * cannot be used to enumerate correct answers.
 */
export const BookmarkProvider = ({ children }) => {
    const [bookmarks, setBookmarks]   = useState([]);
    const [loading, setLoading]       = useState(true);
    const { isAuthenticated }         = useAuth();

    // Fetch all bookmarks once on login — uses limit=200 since bookmarks are user-generated content
    useEffect(() => {
        if (!isAuthenticated) {
            setBookmarks([]);
            setLoading(false);
            return;
        }

        let cancelled = false;
        const fetchBookmarks = async () => {
            try {
                const res = await api.get('/user/bookmarks?limit=100');
                if (!cancelled) setBookmarks(res.data.data || []);
            } catch (err) {
                console.warn('Could not load bookmarks:', err.message);
                if (!cancelled) setBookmarks([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchBookmarks();
        return () => { cancelled = true; };
    }, [isAuthenticated]);

    const addBookmark = useCallback(async (quizId, quizTitle, question, questionIndex) => {
        const tempId = `${quizId}_${questionIndex}`;

        // Strip isCorrect from options — prevents answer exposure via bookmark API
        const safeOptions = (question.options || []).map(({ isCorrect: _, ...opt }) => opt);

        const optimistic = {
            _id:           tempId,
            quizId,
            quizTitle,
            questionIndex,
            questionText:  question.questionText,
            options:       safeOptions,
            explanation:   question.explanation || '',
            difficulty:    question.difficulty  || 'medium',
            createdAt:     new Date().toISOString()
        };

        // Optimistic update — prevents UI stutter
        setBookmarks(prev => {
            if (prev.some(b => b.quizId === quizId && b.questionIndex === questionIndex)) return prev;
            return [optimistic, ...prev];
        });

        try {
            const res = await api.post('/user/bookmarks', {
                quizId,
                quizTitle,
                questionIndex,
                questionText: question.questionText,
                options:      safeOptions,
                explanation:  question.explanation || '',
                difficulty:   question.difficulty  || 'medium'
            });
            // Replace temp entry with server-assigned _id
            setBookmarks(prev => prev.map(b => b._id === tempId ? res.data.data : b));
        } catch (err) {
            if (err.response?.status !== 200) { // 200 = "already bookmarked" — that's OK
                setBookmarks(prev => prev.filter(b => b._id !== tempId));
            }
        }
    }, []);

    const removeBookmark = useCallback(async (quizId, questionIndex) => {
        const bookmark = bookmarks.find(b => b.quizId === quizId && b.questionIndex === questionIndex);
        if (!bookmark) return;

        // Optimistic removal
        setBookmarks(prev => prev.filter(b => !(b.quizId === quizId && b.questionIndex === questionIndex)));

        try {
            if (bookmark._id && !String(bookmark._id).includes('_')) {
                await api.delete(`/user/bookmarks/${bookmark._id}`);
            } else {
                await api.delete(`/user/bookmarks/quiz/${quizId}/question/${questionIndex}`);
            }
        } catch (err) {
            console.error('Failed to remove bookmark:', err);
            setBookmarks(prev => [bookmark, ...prev]); // revert
        }
    }, [bookmarks]);

    const toggleBookmark = useCallback((quizId, quizTitle, question, questionIndex) => {
        const already = bookmarks.some(b => b.quizId === quizId && b.questionIndex === questionIndex);
        if (already) {
            removeBookmark(quizId, questionIndex);
        } else {
            addBookmark(quizId, quizTitle, question, questionIndex);
        }
    }, [bookmarks, addBookmark, removeBookmark]);

    const isBookmarked = useCallback((quizId, questionIndex) => {
        return bookmarks.some(b => b.quizId === quizId && b.questionIndex === questionIndex);
    }, [bookmarks]);

    const getBookmarksByQuiz = useCallback((quizId) => {
        return bookmarks.filter(b => b.quizId === quizId);
    }, [bookmarks]);

    const getBookmarksGroupedByQuiz = useCallback(() => {
        return bookmarks.reduce((acc, bookmark) => {
            if (!acc[bookmark.quizId]) {
                acc[bookmark.quizId] = {
                    quizId:    bookmark.quizId,
                    quizTitle: bookmark.quizTitle,
                    questions: []
                };
            }
            acc[bookmark.quizId].questions.push(bookmark);
            return acc;
        }, {});
    }, [bookmarks]);

    const clearAllBookmarks = useCallback(async () => {
        const prev = [...bookmarks];
        setBookmarks([]);
        try {
            await Promise.all(prev.map(b => api.delete(`/user/bookmarks/${b._id}`)));
        } catch (err) {
            console.error('Failed to clear some bookmarks:', err);
        }
    }, [bookmarks]);

    return (
        <BookmarkContext.Provider value={{
            bookmarks,
            loading,
            addBookmark,
            removeBookmark,
            toggleBookmark,
            isBookmarked,
            getBookmarksByQuiz,
            getBookmarkCount: () => bookmarks.length,
            getBookmarksGroupedByQuiz,
            clearAllBookmarks
        }}>
            {children}
        </BookmarkContext.Provider>
    );
};
