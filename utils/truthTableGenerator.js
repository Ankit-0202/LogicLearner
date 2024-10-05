// utils/truthTableGenerator.js

import { create, all } from 'mathjs';

// Initialize math.js with all functionalities
const math = create(all);

// Define custom logical functions in math.js
math.import({
  // Logical AND
  and: (a, b) => Boolean(a && b),
  // Logical OR
  or: (a, b) => Boolean(a || b),
  // Logical NOT
  not: (a) => Boolean(!a),
  // Logical IMPLIES
  implies: (a, b) => Boolean(!a || b),
  // Logical IFF (if and only if)
  iff: (a, b) => Boolean(a === b),
  // Logical XOR
  xor: (a, b) => Boolean(a !== b),
}, { override: true });

// Function to replace logical operator symbols and words with standardized operators for evaluation
const normalizeOperators = (formula) => {
  return formula
    // Replace 'AND' (case-insensitive) with 'and'
    .replace(/AND|\^/gi, 'and')
    // Replace 'OR' (case-insensitive) with 'or'
    .replace(/OR|\|/gi, 'or')
    // Replace 'NOT', '!', '~' (case-insensitive) with 'not'
    .replace(/NOT|!|~/gi, 'not')
    // Replace 'IMPLIES', '->' (case-insensitive) with 'implies'
    .replace(/IMPLIES|->|⇒/gi, 'implies')
    // Replace 'IFF', '<->' (case-insensitive) with 'iff'
    .replace(/IFF|<->|⇔/gi, 'iff')
    // Replace 'XOR', '⊕' (case-insensitive) with 'xor'
    .replace(/XOR|⊕/gi, 'xor');
};

// Function to replace logical operator words with symbols for display
const replaceOperatorsWithSymbols = (formula) => {
  return formula
    // Replace 'and' with '∧'
    .replace(/and/g, '∧')
    // Replace 'or' with '∨'
    .replace(/or/g, '∨')
    // Replace 'not/g' with '¬'
    .replace(/not/g, '¬')
    // Replace 'implies' with '→'
    .replace(/implies/g, '→')
    // Replace 'iff' with '↔'
    .replace(/iff/g, '↔')
    // Replace 'xor' with '⊕'
    .replace(/xor/g, '⊕');
};

// Function to handle negations
const handleNegations = (expr) => {
  // Replace 'not X' with 'not(X)'
  return expr.replace(/not\s+([A-Za-z]|\([^()]*\))/g, 'not($1)');
};

// Function to prepare the expression for evaluation
const prepareExpression = (formula, row) => {
  // Normalize operators
  let expr = normalizeOperators(formula);

  // Handle negations
  expr = handleNegations(expr);

  // Replace variables with their boolean values
  Object.keys(row).forEach((variable) => {
    const regex = new RegExp(`\\b${variable}\\b`, 'g');
    expr = expr.replace(regex, row[variable]);
  });

  return expr;
};

// Function to validate the formula syntax
export const validateFormula = (formula) => {
  try {
    const normalizedFormula = normalizeOperators(formula);
    const expr = handleNegations(normalizedFormula);

    // Replace variables with 'true' for validation
    const variables = Array.from(new Set(expr.match(/[A-Z]/g)));
    let exprForValidation = expr;
    variables.forEach((variable) => {
      const regex = new RegExp(`\\b${variable}\\b`, 'g');
      exprForValidation = exprForValidation.replace(regex, 'true');
    });

    // Evaluate the expression to check for syntax errors
    math.evaluate(exprForValidation);
    return { valid: true };
  } catch (error) {
    return { valid: false, message: error.message };
  }
};

// Main function to create the truth table
export const createTruthTable = (formula) => {
  // Validate formula syntax
  const validation = validateFormula(formula);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  // Normalize formula for processing
  const normalizedFormula = normalizeOperators(formula);

  // Extract variables (single uppercase letters)
  const variables = Array.from(new Set(normalizedFormula.match(/\b[A-Z]\b/g))).sort();

  if (variables.length === 0) {
    throw new Error('No variables found in the formula.');
  }

  // Prepare headers
  const displayedFormula = replaceOperatorsWithSymbols(formula);
  const headers = [...variables, displayedFormula];

  // Generate truth table
  const numRows = Math.pow(2, variables.length);
  const table = [];

  for (let i = 0; i < numRows; i++) {
    const row = {};
    const binary = i.toString(2).padStart(variables.length, '0');

    // Assign truth values to variables
    variables.forEach((variable, index) => {
      const value = binary[index] === '1';
      row[variable] = value ? 1 : 0;
    });

    // Evaluate the formula
    const expr = prepareExpression(formula, row);
    try {
      const result = math.evaluate(expr);
      row[displayedFormula] = result ? 1 : 0;
    } catch (error) {
      row[displayedFormula] = 'Error';
    }

    table.push(row);
  }

  return { headers, table };
};
