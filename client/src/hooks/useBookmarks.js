import { useState, useEffect, useCallback } from 'react';

const BOOKMARKS_KEY = 'quizmaster_bookmarks';

/**
 * Custom hook for managing bookmarked questions
 * Persists bookmarks to localStorage
 * 
 * Bookmark structure:
 * {
 *   id: 'quiz-id_question-id',
 *   quizId: string,
 *   quizTitle: string,
 *   questionId: number,
 *   questionText: string,
 *   options: array,
 *   explanation: string,
 *   bookmarkedAt: timestamp
 * }
 */
const useBookmarks = () => {
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            const stored = localStorage.getItem(BOOKMARKS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading bookmarks:', error);
            return [];
        }
    });

    // Sync to localStorage whenever bookmarks change
    useEffect(() => {
        try {
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        } catch (error) {
            console.error('Error saving bookmarks:', error);
        }
    }, [bookmarks]);

    /**
     * Add a question to bookmarks
     */
    const addBookmark = useCallback((quizId, quizTitle, question) => {
        const bookmarkId = `${quizId}_${question.id}`;
        
        setBookmarks(prev => {
            // Check if already bookmarked
            if (prev.some(b => b.id === bookmarkId)) {
                return prev;
            }
            
            return [...prev, {
                id: bookmarkId,
                quizId,
                quizTitle,
                questionId: question.id,
                questionText: question.questionText,
                options: question.options,
                explanation: question.explanation,
                bookmarkedAt: Date.now()
            }];
        });
    }, []);

    /**
     * Remove a question from bookmarks
     */
    const removeBookmark = useCallback((quizId, questionId) => {
        const bookmarkId = `${quizId}_${questionId}`;
        setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    }, []);

    /**
     * Toggle bookmark status for a question
     */
    const toggleBookmark = useCallback((quizId, quizTitle, question) => {
        const bookmarkId = `${quizId}_${question.id}`;
        const isBookmarked = bookmarks.some(b => b.id === bookmarkId);
        
        if (isBookmarked) {
            removeBookmark(quizId, question.id);
        } else {
            addBookmark(quizId, quizTitle, question);
        }
    }, [bookmarks, addBookmark, removeBookmark]);

    /**
     * Check if a question is bookmarked
     */
    const isBookmarked = useCallback((quizId, questionId) => {
        const bookmarkId = `${quizId}_${questionId}`;
        return bookmarks.some(b => b.id === bookmarkId);
    }, [bookmarks]);

    /**
     * Get all bookmarks for a specific quiz
     */
    const getBookmarksByQuiz = useCallback((quizId) => {
        return bookmarks.filter(b => b.quizId === quizId);
    }, [bookmarks]);

    /**
     * Get total bookmark count
     */
    const getBookmarkCount = useCallback(() => {
        return bookmarks.length;
    }, [bookmarks]);

    /**
     * Clear all bookmarks
     */
    const clearAllBookmarks = useCallback(() => {
        setBookmarks([]);
    }, []);

    /**
     * Get bookmarks grouped by quiz
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

    return {
        bookmarks,
        addBookmark,
        removeBookmark,
        toggleBookmark,
        isBookmarked,
        getBookmarksByQuiz,
        getBookmarkCount,
        clearAllBookmarks,
        getBookmarksGroupedByQuiz
    };
};

export default useBookmarks;
