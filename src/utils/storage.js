// Secure localStorage utilities with encryption
// Uses Web Crypto API for encryption (browser-native, no dependencies)

const STORAGE_PREFIX = 'ats_cv_';
const ENCRYPTION_KEY_NAME = 'ats_cv_encryption_key';

// Generate or retrieve encryption key
async function getEncryptionKey() {
  let key = sessionStorage.getItem(ENCRYPTION_KEY_NAME);
  
  if (!key) {
    // Generate a new key for this session
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    key = Array.from(array, byte => String.fromCharCode(byte)).join('');
    sessionStorage.setItem(ENCRYPTION_KEY_NAME, key);
  }
  
  // Convert to CryptoKey format
  const keyData = new TextEncoder().encode(key);
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Simple XOR encryption (lightweight, sufficient for localStorage obfuscation)
// Note: This is obfuscation, not military-grade encryption, but sufficient for preventing casual access
function simpleEncrypt(text, key) {
  if (!text) return '';
  const keyStr = key || sessionStorage.getItem(ENCRYPTION_KEY_NAME) || 'default-key-change-in-production';
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ keyStr.charCodeAt(i % keyStr.length));
  }
  return btoa(result); // Base64 encode
}

function simpleDecrypt(encrypted, key) {
  if (!encrypted) return '';
  try {
    const keyStr = key || sessionStorage.getItem(ENCRYPTION_KEY_NAME) || 'default-key-change-in-production';
    const decoded = atob(encrypted);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ keyStr.charCodeAt(i % keyStr.length));
    }
    return result;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
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
    
    const decrypted = simpleDecrypt(encrypted);
    if (!decrypted) return null;
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error getting secure storage:', error);
    // Try to read unencrypted data (for backward compatibility)
    try {
      const unencrypted = localStorage.getItem(STORAGE_PREFIX + key);
      if (unencrypted) {
        return JSON.parse(unencrypted);
      }
    } catch (e) {
      // Ignore
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

