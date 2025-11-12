export const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
export const isValidName = text => /^[\p{L}\s'-]+$/u.test(String(text || ""));
export const isValidMessage = text => /^[\p{L}\p{N}\s.,!?;:'"()\-@äöüÄÖÜßéèêàáâçñ€$%&/\\]+$/u.test(String(text || ""));