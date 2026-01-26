// Rate limiting utility for non-authenticated users
// Uses browser fingerprinting + localStorage to track requests

const RATE_LIMIT_KEY = 'ats_cv_rate_limit';
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_HOUR = 3; // Max 3 AI requests per hour for non-logged-in users

// Generate a simple browser fingerprint
function generateFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Browser fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Create a simple hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
}

// Get or create fingerprint
function getFingerprint() {
  let fp = localStorage.getItem('ats_cv_fingerprint');
  if (!fp) {
    fp = generateFingerprint();
    localStorage.setItem('ats_cv_fingerprint', fp);
  }
  return fp;
}

// Check if user can make an AI request
export function canMakeAIRequest() {
  try {
    const fingerprint = getFingerprint();
    const now = Date.now();
    const rateLimitData = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
    
    // Clean up old entries (older than 1 hour)
    Object.keys(rateLimitData).forEach(key => {
      if (now - rateLimitData[key].firstRequest > RATE_LIMIT_WINDOW) {
        delete rateLimitData[key];
      }
    });
    
    const userData = rateLimitData[fingerprint];
    
    if (!userData) {
      // First request - allow it
      rateLimitData[fingerprint] = {
        firstRequest: now,
        requestCount: 1,
        lastRequest: now
      };
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rateLimitData));
      return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1 };
    }
    
    // Check if window has expired
    if (now - userData.firstRequest > RATE_LIMIT_WINDOW) {
      // Reset window
      rateLimitData[fingerprint] = {
        firstRequest: now,
        requestCount: 1,
        lastRequest: now
      };
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rateLimitData));
      return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1 };
    }
    
    // Check if limit exceeded
    if (userData.requestCount >= MAX_REQUESTS_PER_HOUR) {
      const timeUntilReset = RATE_LIMIT_WINDOW - (now - userData.firstRequest);
      const minutesUntilReset = Math.ceil(timeUntilReset / (60 * 1000));
      return { 
        allowed: false, 
        remaining: 0,
        resetIn: minutesUntilReset,
        message: `Rate limit exceeded. Please wait ${minutesUntilReset} minute(s) or log in for unlimited access.`
      };
    }
    
    // Increment count
    userData.requestCount += 1;
    userData.lastRequest = now;
    rateLimitData[fingerprint] = userData;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rateLimitData));
    
    return { 
      allowed: true, 
      remaining: MAX_REQUESTS_PER_HOUR - userData.requestCount 
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Fail open for logged-in users, fail closed for anonymous
    return { allowed: false, remaining: 0, message: 'Rate limit check failed. Please log in.' };
  }
}

// Record an AI request (call this after successful request)
export function recordAIRequest() {
  try {
    const fingerprint = getFingerprint();
    const rateLimitData = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
    const userData = rateLimitData[fingerprint];
    
    if (userData) {
      // Already incremented in canMakeAIRequest, just update timestamp
      userData.lastRequest = Date.now();
      rateLimitData[fingerprint] = userData;
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rateLimitData));
    }
  } catch (error) {
    console.error('Rate limit record error:', error);
  }
}

// Reset rate limit for a fingerprint (useful for testing or admin)
export function resetRateLimit(fingerprint = null) {
  try {
    const rateLimitData = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
    if (fingerprint) {
      delete rateLimitData[fingerprint];
    } else {
      // Clear all
      Object.keys(rateLimitData).forEach(key => delete rateLimitData[key]);
    }
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rateLimitData));
  } catch (error) {
    console.error('Rate limit reset error:', error);
  }
}

// Get remaining requests for current user
export function getRemainingRequests() {
  try {
    const fingerprint = getFingerprint();
    const now = Date.now();
    const rateLimitData = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
    const userData = rateLimitData[fingerprint];
    
    if (!userData) {
      return MAX_REQUESTS_PER_HOUR;
    }
    
    // Check if window has expired
    if (now - userData.firstRequest > RATE_LIMIT_WINDOW) {
      return MAX_REQUESTS_PER_HOUR;
    }
    
    return Math.max(0, MAX_REQUESTS_PER_HOUR - userData.requestCount);
  } catch (error) {
    return 0;
  }
}

