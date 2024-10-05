// utils/truthTableGenerator.js

import { create, all } from 'mathjs';

// Initialize math.js with all functionalities
const math = create(all);

// Define custom logical functions in math.js to handle implications, biconditionals, and XOR
math.import({
  // Logical AND
  and: (a, b) => a && b,
  // Logical OR
  or: (a, b) => a || b,
  // Logical NOT
  not: (a) => !a,
  // Logical IMPLIES
  implies: (a, b) => !a || b,
  // Logical IFF (if and only if)
  iff: (a, b) => a === b,
  // Logical XOR
  xor: (a, b) => a !== b,
}, { override: true });

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

// Function to replace logical operator symbols and words with standardized operators for evaluation
const normalizeOperators = (formula) => {
  return formula
    // Replace 'AND' (case-insensitive) with 'and'
    .replace(/AND/gi, 'and')
    // Replace 'OR' (case-insensitive) with 'or'
    .replace(/OR/gi, 'or')
    // Replace 'NOT', '!', '~' (case-insensitive) with 'not'
    .replace(/NOT|!|~/gi, 'not')
    // Replace 'IMPLIES', '->' (case-insensitive) with 'implies'
    .replace(/IMPLIES|->/gi, 'implies')
    // Replace 'IFF', '<->' (case-insensitive) with 'iff'
    .replace(/IFF|<->/gi, 'iff')
    // Replace 'XOR', '⊕' (case-insensitive) with 'xor'
    .replace(/XOR|⊕/gi, 'xor');
};

// Function to replace logical operator symbols and words with symbols for display
const replaceOperatorsWithSymbols = (f) => {
  return f
    // Replace 'and' with '∧'
    .replace(/and/g, '∧')
    // Replace 'or' with '∨'
    .replace(/or/g, '∨')
    // Replace 'not' with '¬'
    .replace(/not/g, '¬')
    // Replace 'implies' with '→'
    .replace(/implies/g, '→')
    // Replace 'iff' with '↔'
    .replace(/iff/g, '↔')
    // Replace 'xor' with '⊕'
    .replace(/xor/g, '⊕');
};

// Function to sanitize and prepare the expression for evaluation
const prepareExpression = (formula, row) => {
  // Normalize operators to standardized logical operators
  let expr = normalizeOperators(formula);

  // Replace variables with their boolean values (true/false)
  Object.keys(row).forEach((variable) => {
    if (variable !== 'Result') {
      // Ensure that only standalone variables are replaced
      const regex = new RegExp(`\\b${variable}\\b`, 'g');
      expr = expr.replace(regex, row[variable] === 1 ? 'true' : 'false');
    }
  });

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
  // Prioritize longer operators first to prevent partial matches
  const tokens = normalizedFormula.match(/(\b[A-Z]\b|<->|->|AND|OR|NOT|IMPLIES|IFF|XOR|&|\||~|\(|\))/gi);
  if (!tokens) {
    return { valid: false, message: 'No valid tokens found in the formula.' };
  }

  // Define operators
  const operators = ['AND', 'OR', 'NOT', 'IMPLIES', 'IFF', 'XOR', '&', '|', '~', '->', '<->'];

  // Ensure that variables are single uppercase letters
  for (let token of tokens) {
    if (/^[A-Z]$/.test(token)) {
      continue; // Valid variable
    } else if (operators.includes(token.toUpperCase()) || token === '(' || token === ')') {
      continue; // Valid operator or parenthesis
    } else {
      return { valid: false, message: `Invalid token "${token}" in the formula.` };
    }
  }

  // Ensure that the formula does not end with an operator
  const lastToken = tokens[tokens.length - 1].toUpperCase();
  if (operators.includes(lastToken)) {
    return { valid: false, message: 'Formula cannot end with an operator.' };
  }

  // Check for proper operator-operand sequence
  let expectOperand = true;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].toUpperCase();
    if (operators.includes(token)) {
      if (token === 'NOT') {
        expectOperand = true; // Unary operator expects an operand
      } else {
        expectOperand = true; // Binary operator expects an operand next
      }
    } else if (/^[A-Z]$/.test(token)) {
      if (!expectOperand) {
        return { valid: false, message: `Unexpected operand "${token}" at position ${i + 1}` };
      }
      expectOperand = false;
    } else if (token === '(') {
      expectOperand = true;
    } else if (token === ')') {
      expectOperand = false;
    }
  }

  return { valid: true };
};

// Main function to create the truth table
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
