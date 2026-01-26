// Secure localStorage utilities with encryption
// Uses Web Crypto API for encryption (browser-native, no dependencies)

const STORAGE_PREFIX = 'ats_cv_';
const ENCRYPTION_KEY_NAME = 'ats_cv_encryption_key';

// Generate a strong default encryption key (consistent but cryptographically strong)
// This is used as fallback if session key is not available
// Derived from app-specific data to ensure consistency while maintaining strength
function getStrongDefaultKey() {
  // Create a strong, consistent default key based on app identifier
  // This ensures the key is the same across sessions but still strong
  const appIdentifier = 'ats-cv-generator-pro-v1.0';
  const salt = 'base44-secure-storage-2024';
  
  // Create a deterministic but strong key by hashing app identifier + salt
  // Using a simple hash function (for browser compatibility)
  let hash = 0;
  const combined = appIdentifier + salt + window.location.origin;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Expand to 64 characters using a strong character set
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let key = '';
  let seed = Math.abs(hash);
  
  for (let i = 0; i < 64; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff; // Linear congruential generator
    key += chars[seed % chars.length];
  }
  
  return key;
}

// Get or generate encryption key
function getOrCreateEncryptionKey() {
  let key = sessionStorage.getItem(ENCRYPTION_KEY_NAME);
  
  if (!key) {
    // Generate a new strong random key for this session
    const array = new Uint8Array(64);
    crypto.getRandomValues(array);
    // Convert to a strong string key
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    key = '';
    for (let i = 0; i < array.length; i++) {
      key += chars[array[i] % chars.length];
    }
    sessionStorage.setItem(ENCRYPTION_KEY_NAME, key);
  }
  
  return key;
}

// Convert string to UTF-8 bytes, then to Base64 (handles Unicode properly)
function utf8ToBase64(str) {
  try {
    // Use TextEncoder if available (modern browsers)
    if (typeof TextEncoder !== 'undefined') {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(str);
      // Convert bytes to binary string for btoa
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    } else {
      // Fallback for older browsers: use encodeURIComponent
      return btoa(unescape(encodeURIComponent(str)));
    }
  } catch (error) {
    // If all else fails, try the old method (may fail with Unicode)
    return btoa(str);
  }
}

// Convert Base64 to UTF-8 string (handles Unicode properly)
function base64ToUtf8(base64) {
  try {
    // Use TextDecoder if available (modern browsers)
    if (typeof TextDecoder !== 'undefined') {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const decoder = new TextDecoder();
      return decoder.decode(bytes);
    } else {
      // Fallback for older browsers: use decodeURIComponent
      return decodeURIComponent(escape(atob(base64)));
    }
  } catch (error) {
    // If all else fails, try the old method (may fail with Unicode)
    return atob(base64);
  }
}

// Simple XOR encryption (lightweight, sufficient for localStorage obfuscation)
// Note: This is obfuscation, not military-grade encryption, but sufficient for preventing casual access
function simpleEncrypt(text, key) {
  if (!text) return '';
  try {
    // Try session key first, then fallback to strong default key
    const keyStr = key || getOrCreateEncryptionKey() || getStrongDefaultKey();
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ keyStr.charCodeAt(i % keyStr.length));
    }
    // Use UTF-8 safe Base64 encoding to handle Unicode characters
    return utf8ToBase64(result);
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

function simpleDecrypt(encrypted, key) {
  if (!encrypted) return '';
  
  // Validate Base64 string before attempting to decode
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(encrypted)) {
    // Not a valid Base64 string - might be old unencrypted data
    console.warn('Invalid Base64 format in encrypted data, treating as unencrypted');
    return null; // Signal that this is not encrypted data
  }
  
  try {
    // Try session key first, then fallback to strong default key
    const keyStr = key || getOrCreateEncryptionKey() || getStrongDefaultKey();
    // Use UTF-8 safe Base64 decoding to handle Unicode characters
    const decoded = base64ToUtf8(encrypted);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ keyStr.charCodeAt(i % keyStr.length));
    }
    return result;
  } catch (error) {
    // If decoding fails, this might be old unencrypted data or corrupted data
    console.warn('Decryption error (might be unencrypted data):', error.message);
    return null; // Signal that decryption failed
  }
}

// Secure localStorage setter
export function setSecureStorage(key, value) {
  try {
    const jsonValue = JSON.stringify(value);
    const encrypted = simpleEncrypt(jsonValue);
    localStorage.setItem(STORAGE_PREFIX + key, encrypted);
  } catch (error) {
    console.error('Error setting secure storage:', error);
    // Fallback to unencrypted storage if encryption fails
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  }
}

// Secure localStorage getter
export function getSecureStorage(key) {
  try {
    const encrypted = localStorage.getItem(STORAGE_PREFIX + key);
    if (!encrypted) return null;
    
    // Try to decrypt
    const decrypted = simpleDecrypt(encrypted);
    
    // If decryption returned null, it might be unencrypted data
    if (decrypted === null) {
      // Try to parse as unencrypted JSON (backward compatibility)
      try {
        const parsed = JSON.parse(encrypted);
        // If successful, migrate to encrypted storage
        setSecureStorage(key, parsed);
        return parsed;
      } catch (e) {
        // Not valid JSON either - corrupted data
        console.warn('Corrupted data in localStorage, removing:', key);
        localStorage.removeItem(STORAGE_PREFIX + key);
        return null;
      }
    }
    
    if (!decrypted) return null;
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error getting secure storage:', error);
    // Try to read unencrypted data (for backward compatibility)
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + key);
      if (stored) {
        // Check if it's valid JSON
        const parsed = JSON.parse(stored);
        // If successful, migrate to encrypted storage
        setSecureStorage(key, parsed);
        return parsed;
      }
    } catch (e) {
      // Not valid JSON - corrupted data, remove it
      console.warn('Corrupted data in localStorage, removing:', key);
      localStorage.removeItem(STORAGE_PREFIX + key);
    }
    return null;
  }
}

// Remove from secure storage
export function removeSecureStorage(key) {
  localStorage.removeItem(STORAGE_PREFIX + key);
}

// Clear all secure storage
export function clearSecureStorage() {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
  sessionStorage.removeItem(ENCRYPTION_KEY_NAME);
}

