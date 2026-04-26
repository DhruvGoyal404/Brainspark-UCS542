/**
 * useBookmarks — thin wrapper around BookmarkContext.
 *
 * All components that previously called useBookmarks() will continue to work
 * unchanged: the hook API is identical.  The difference is that state now
 * lives in BookmarkContext and is shared across the entire component tree,
 * so mounting multiple consumers no longer triggers duplicate API calls.
 */
import { useBookmarkContext } from '../context/BookmarkContext';

const useBookmarks = () => useBookmarkContext();

export default useBookmarks;
