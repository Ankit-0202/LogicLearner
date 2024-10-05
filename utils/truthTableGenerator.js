// utils/truthTableGenerator.js

import { create, all } from 'mathjs';

// Configure math.js with custom logical operators
const config = {};

// Initialize math.js
const math = create(all, config);

// Define custom logical functions and override existing ones to return numeric values
math.import(
  {
    AND: (a, b) => (a && b) ? 1 : 0,
    OR: (a, b) => (a || b) ? 1 : 0,
    NOT: (a) => (!a) ? 1 : 0,
    IMPLIES: (a, b) => (!a || b) ? 1 : 0,
    IFF: (a, b) => (a === b) ? 1 : 0,
    XOR: (a, b) => (a !== b) ? 1 : 0,
    // Symbol-based operators
    '&': (a, b) => (a && b) ? 1 : 0,
    '|': (a, b) => (a || b) ? 1 : 0,
    '~': (a) => (!a) ? 1 : 0,
    '->': (a, b) => (!a || b) ? 1 : 0,
    '<->': (a, b) => (a === b) ? 1 : 0,
    '⊕': (a, b) => (a !== b) ? 1 : 0,
  },
  { override: true }
);

// Function to extract subformulas using a stack-based approach
const extractSubformulas = (formula) => {
  const stack = [];
  const subformulas = new Set();
  const openIndices = [];

  for (let i = 0; i < formula.length; i++) {
    if (formula[i] === '(') {
      stack.push('(');
      openIndices.push(i);
    } else if (formula[i] === ')') {
      if (stack.length === 0) {
        // Unmatched closing parenthesis; handled in validation
        continue;
      }
      stack.pop();
      const startIndex = openIndices.pop();
      if (stack.length === 0) {
        const subformula = formula.slice(startIndex + 1, i).trim();
        if (subformula.length > 0) {
          subformulas.add(subformula);
        }
      }
    }
  }

  return Array.from(subformulas);
};

// Function to replace logical operator words and symbols with symbols for display
const replaceOperatorsWithSymbols = (f) => {
  return f
    .replace(/AND|and/g, '∧')
    .replace(/OR|or/g, '∨')
    .replace(/NOT|not/g, '¬')
    .replace(/IMPLIES|implies/g, '→')
    .replace(/IFF|iff/g, '↔')
    .replace(/XOR|xor/g, '⊕')
    .replace(/\|/g, '∨')
    .replace(/&/g, '∧')
    .replace(/~/g, '¬');
};

// Function to sanitize and prepare the expression for evaluation
const prepareExpression = (formula, row) => {
  let expr = formula;

  // Replace variables with their truth values (1 and 0)
  Object.keys(row).forEach((variable) => {
    if (variable !== 'Result') {
      // Use word boundaries to replace only whole words
      const regex = new RegExp(`\\b${variable}\\b`, 'g');
      expr = expr.replace(regex, row[variable]);
    }
  });

  // Replace textual and symbol-based operators with symbolic equivalents for evaluation
  expr = expr
    .replace(/AND|and/gi, '&')
    .replace(/OR|or/gi, '|')
    .replace(/NOT|not/gi, '~')
    .replace(/IMPLIES|implies/gi, '->')
    .replace(/IFF|iff/gi, '<->')
    .replace(/XOR|xor/gi, '⊕');

  return expr;
};

// Function to validate the formula syntax
const validateFormula = (formula) => {
  // Normalize the formula: remove extra spaces
  const normalizedFormula = formula.replace(/\s+/g, ' ').trim();

  // Check for balanced parentheses
  let stack = [];
  for (let i = 0; i < normalizedFormula.length; i++) {
    if (normalizedFormula[i] === '(') {
      stack.push(i);
    } else if (normalizedFormula[i] === ')') {
      if (stack.length === 0) {
        return { valid: false, message: `Unmatched closing parenthesis at position ${i + 1}` };
      }
      stack.pop();
    }
  }
  if (stack.length > 0) {
    return { valid: false, message: `Unmatched opening parenthesis at position ${stack.pop() + 1}` };
  }

  // Tokenize the formula
  const tokens = normalizedFormula.match(/(\b[A-Z]\b|AND|OR|NOT|IMPLIES|IFF|XOR|&|\||~|->|<->|\(|\))/gi);
  if (!tokens) {
    return { valid: false, message: 'No valid tokens found in the formula.' };
  }

  // Define operators
  const operators = ['AND', 'OR', 'NOT', 'IMPLIES', 'IFF', 'XOR', '&', '|', '~', '->', '<->'];

  let expectOperand = true;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].toUpperCase();
    if (operators.includes(token)) {
      if (token === 'NOT' || token === '~') {
        // Unary operator expects an operand next
        expectOperand = true;
      } else {
        // Binary operator expects an operand next
        expectOperand = true;
      }
    } else if (/^[A-Z]$/.test(token)) {
      // Operand
      if (!expectOperand) {
        return { valid: false, message: `Unexpected operand "${token}" at token ${i + 1}` };
      }
      expectOperand = false;
    } else {
      return { valid: false, message: `Invalid token "${token}" at token ${i + 1}` };
    }
  }

  if (expectOperand) {
    return { valid: false, message: 'Formula cannot end with an operator.' };
  }

  return { valid: true };
};

export const createTruthTable = (formula) => {
  // Normalize the formula: remove extra spaces
  const normalizedFormula = formula.replace(/\s+/g, ' ').trim();

  // Validate formula syntax
  const validation = validateFormula(normalizedFormula);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  // Extract subformulas
  const subformulas = extractSubformulas(normalizedFormula);

  // Replace operator words and symbols with symbols for display
  const symbolizedSubformulas = subformulas.map((sub) => replaceOperatorsWithSymbols(sub));
  const symbolizedFormula = replaceOperatorsWithSymbols(normalizedFormula);

  // Extract unique variables from the formula (single uppercase letters)
  // Use word boundaries to match only single uppercase letters not part of words
  const variablesMatch = normalizedFormula.match(/\b[A-Z]\b/g);
  const variables = variablesMatch ? Array.from(new Set(variablesMatch)).sort() : [];

  if (variables.length === 0) {
    throw new Error('No variables found in the formula.');
  }

  // Define headers: variables, subformulas, and the main formula
  const headers = [...variables, ...symbolizedSubformulas, symbolizedFormula];

  // Remove any empty headers (if symbolizedFormula is empty)
  const filteredHeaders = headers.filter((header) => header.trim() !== '');

  const numRows = Math.pow(2, variables.length);
  const table = [];

  for (let i = 0; i < numRows; i++) {
    const row = {};
    const binary = i.toString(2).padStart(variables.length, '0');

    // Assign truth values to variables as 1 and 0
    variables.forEach((variable, index) => {
      row[variable] = binary[index] === '1' ? 1 : 0;
    });

    // Evaluate subformulas
    subformulas.forEach((subformula, index) => {
      const symbolizedSub = symbolizedSubformulas[index];
      const expr = prepareExpression(subformula, row);
      try {
        const result = math.evaluate(expr);
        row[symbolizedSub] = result ? 1 : 0;
      } catch (error) {
        row[symbolizedSub] = 'Error';
      }
    });

    // Evaluate the main formula
    const mainExpr = prepareExpression(normalizedFormula, row);
    try {
      const mainResult = math.evaluate(mainExpr);
      row[symbolizedFormula] = mainResult ? 1 : 0;
    } catch (error) {
      row[symbolizedFormula] = 'Error';
    }

    table.push(row);
  }

  return { headers: filteredHeaders, table };
};
