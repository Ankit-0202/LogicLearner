// src/utils/regexUtils.js

export const validateRegex = (regex) => {
  // Define a regular expression that matches the allowed syntax
  // Allowed characters: a-z, A-Z, 0-9, (), |, *, and possibly space
  const allowedPattern = /^([a-zA-Z0-9\|\*\(\)]+)$/;

  if (!regex) {
    return { valid: false, message: 'Regex cannot be empty.' };
  }

  if (!allowedPattern.test(regex)) {
    return { valid: false, message: 'Invalid characters detected. Only a-z, A-Z, 0-9, |, *, and () are allowed.' };
  }

  // Additional validation: Check for balanced parentheses
  let stack = [];
  for (let char of regex) {
    if (char === '(') {
      stack.push(char);
    } else if (char === ')') {
      if (stack.length === 0) {
        return { valid: false, message: 'Unbalanced parentheses detected.' };
      }
      stack.pop();
    }
  }

  if (stack.length !== 0) {
    return { valid: false, message: 'Unbalanced parentheses detected.' };
  }

  return { valid: true, message: 'Valid regex.' };
};
