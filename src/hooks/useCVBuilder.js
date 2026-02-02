import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { canMakeAIRequest, recordAIRequest, getRemainingRequests } from '@/utils/rateLimiter';
import { setSecureStorage, getSecureStorage } from '@/utils/storage';
import { toast } from "@/components/ui/use-toast";

const STORAGE_KEY = 'form_data';
const SUBMISSION_KEY = 'submission_id';
const STORAGE_KEY_TEMPLATE = 'selected_template';

export const useAuthUser = ({ enabled = true } = {}) => {
  const [user, setUser] = useState(null);
  const [authCheckAttempts, setAuthCheckAttempts] = useState(0);
  const lastAuthCheckRef = useRef(0);

  const loadUser = async () => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastAuthCheckRef.current;
    const minInterval = 5000;
    
    if (timeSinceLastCheck < minInterval && authCheckAttempts > 0) {
      return;
    }
    
    if (authCheckAttempts >= 3) {
      const backoffTime = Math.min(30000 * Math.pow(2, authCheckAttempts - 3), 300000);
      if (timeSinceLastCheck < backoffTime) {
        return;
      }
    }
    
    lastAuthCheckRef.current = now;
    
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setAuthCheckAttempts(0);
    } catch (error) {
      setAuthCheckAttempts(prev => prev + 1);
      setUser(null);
    }
  };

  useEffect(() => {
    if (enabled) {
      loadUser();
    }
  }, [enabled]);

  return { user, loadUser };
};

export const useRemainingAIRequests = (user) => {
  const [remainingRequests, setRemainingRequests] = useState(null);

  useEffect(() => {
    if (user) {
      setRemainingRequests(null); // Unlimited for authenticated users
    } else {
      setRemainingRequests(getRemainingRequests());
    }
  }, [user]);

  return remainingRequests;
};

