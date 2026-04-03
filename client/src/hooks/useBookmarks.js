import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

/**
 * API-backed bookmarks hook.
 * Syncs with MongoDB via /api/user/bookmarks.
 * Falls back gracefully if API is unavailable.
 *
 * Bookmark object shape (from server):
 * { _id, quizId, quizTitle, questionIndex, questionText, options[], explanation, difficulty, createdAt }
 */
const useBookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    // ── Load bookmarks from API on mount ──
    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const res = await api.get('/user/bookmarks');
                setBookmarks(res.data.data || []);
            } catch (err) {
                console.warn('Could not load bookmarks from API, using localStorage fallback');
                try {
                    const stored = localStorage.getItem('quizmaster_bookmarks');
                    setBookmarks(stored ? JSON.parse(stored) : []);
                } catch {
                    setBookmarks([]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchBookmarks();
    }, []);

    /**
     * Add a bookmark
     * @param {string} quizId - quiz string slug
     * @param {string} quizTitle
     * @param {Object} question - { id (index), questionText, options, explanation, difficulty }
     * @param {number} questionIndex - 0-based index in quiz.questions array
     */
    const addBookmark = useCallback(async (quizId, quizTitle, question, questionIndex) => {
        const tempId = `${quizId}_${questionIndex}`;
        // Optimistic update
        const optimistic = {
            _id: tempId,
            quizId,
            quizTitle,
            questionIndex,
            questionText: question.questionText,
            options: question.options,
            explanation: question.explanation || '',
            difficulty: question.difficulty || 'medium',
            createdAt: new Date().toISOString()
        };
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
                options: question.options,
                explanation: question.explanation || '',
                difficulty: question.difficulty || 'medium'
            });
            // Replace optimistic entry with real _id from server
            setBookmarks(prev =>
                prev.map(b => b._id === tempId ? res.data.data : b)
            );
        } catch (err) {
            if (err.response?.status !== 200) { // 200 = already bookmarked, that's ok
                console.error('Failed to save bookmark:', err);
                // Revert optimistic update only on real error
                setBookmarks(prev => prev.filter(b => b._id !== tempId));
            }
        }
    }, []);

    /**
     * Remove a bookmark by quizId + questionIndex
     */
    const removeBookmark = useCallback(async (quizId, questionIndex) => {
        const bookmark = bookmarks.find(b => b.quizId === quizId && b.questionIndex === questionIndex);
        if (!bookmark) return;

        // Optimistic removal
        setBookmarks(prev => prev.filter(b => !(b.quizId === quizId && b.questionIndex === questionIndex)));

        try {
            if (bookmark._id && !bookmark._id.includes('_')) {
                // Real server ID
                await api.delete(`/user/bookmarks/${bookmark._id}`);
            } else {
                await api.delete(`/user/bookmarks/quiz/${quizId}/question/${questionIndex}`);
            }
        } catch (err) {
            console.error('Failed to remove bookmark:', err);
            // Revert
            setBookmarks(prev => [bookmark, ...prev]);
        }
    }, [bookmarks]);

    /**
     * Toggle bookmark for a question
     */
    const toggleBookmark = useCallback((quizId, quizTitle, question, questionIndex) => {
        const alreadyBookmarked = isBookmarked(quizId, questionIndex);
        if (alreadyBookmarked) {
            removeBookmark(quizId, questionIndex);
        } else {
            addBookmark(quizId, quizTitle, question, questionIndex);
        }
    }, [bookmarks, addBookmark, removeBookmark]);

    /**
     * Check if a question is bookmarked
     */
    const isBookmarked = useCallback((quizId, questionIndex) => {
        return bookmarks.some(b => b.quizId === quizId && b.questionIndex === questionIndex);
    }, [bookmarks]);

    /**
     * Get all bookmarks for a specific quiz
     */
    const getBookmarksByQuiz = useCallback((quizId) => {
        return bookmarks.filter(b => b.quizId === quizId);
    }, [bookmarks]);

    /**
     * Get bookmarks grouped by quizId
     */
    const getBookmarksGroupedByQuiz = useCallback(() => {
        return bookmarks.reduce((acc, bookmark) => {
            if (!acc[bookmark.quizId]) {
                acc[bookmark.quizId] = {
                    quizId: bookmark.quizId,
                    quizTitle: bookmark.quizTitle,
                    questions: []
                };
            }
            acc[bookmark.quizId].questions.push(bookmark);
            return acc;
        }, {});
    }, [bookmarks]);

    /**
     * Clear all bookmarks (local + remote for each)
     */
    const clearAllBookmarks = useCallback(async () => {
        const prev = [...bookmarks];
        setBookmarks([]);
        try {
            await Promise.all(prev.map(b => api.delete(`/user/bookmarks/${b._id}`)));
        } catch (err) {
            console.error('Failed to clear some bookmarks:', err);
        }
    }, [bookmarks]);

    return {
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
    };
};

export default useBookmarks;
