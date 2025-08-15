// Password generation utilities
export const generateSecurePassword = (length: number = 12): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const generateSimplePassword = (length: number = 8): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return password;
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Şifre en az 8 karakter olmalıdır');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('En az bir küçük harf içermelidir');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('En az bir büyük harf içermelidir');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('En az bir rakam içermelidir');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  if (score <= 2) {
    return { score, label: 'Zayıf', color: 'text-red-600' };
  } else if (score <= 4) {
    return { score, label: 'Orta', color: 'text-yellow-600' };
  } else {
    return { score, label: 'Güçlü', color: 'text-green-600' };
  }
};