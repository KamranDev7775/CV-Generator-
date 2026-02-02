import { useRef, useEffect } from 'react';

/**
 * Hook to track component mount state
 * Returns a function that checks if component is still mounted
 * Use this to prevent state updates on unmounted components
 */
export function useIsMounted() {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
}

export default useIsMounted;
