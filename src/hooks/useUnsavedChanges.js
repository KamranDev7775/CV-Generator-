import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to detect unsaved changes and warn user before navigation
 * @param {boolean} hasUnsavedChanges - Whether there are unsaved changes
 * @param {string} message - Custom warning message
 */
export function useUnsavedChanges(hasUnsavedChanges, message = 'You have unsaved changes. Are you sure you want to leave?') {
  const location = useLocation();
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);

  // Update ref when hasUnsavedChanges changes
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChangesRef.current) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    // Warn before page unload (browser close/refresh)
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [message]);

  // Note: React Router navigation blocking would require useBlocker (React Router v6.4+)
  // For now, we only handle browser navigation (close/refresh)
  // In-app navigation warnings can be added with custom confirmation dialogs if needed

  return {
    hasUnsavedChanges: hasUnsavedChangesRef.current
  };
}

export default useUnsavedChanges;

