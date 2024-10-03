// utils/truthTableGenerator.js

import { create, all } from 'mathjs';

// Configure math.js with custom logical operators
const config = {
  // No specific configurations needed
};

const math = create(all, config);

// Define custom logical functions
math.import({
  AND: (a, b) => a && b,
  OR: (a, b) => a || b,
  NOT: (a) => !a,
  IMPLIES: (a, b) => !a || b,
  IFF: (a, b) => a === b,
  // Symbol-based operators
  '&': (a, b) => a && b,
  '|': (a, b) => a || b,
  '~': (a) => !a,
  '->': (a, b) => !a || b,
  '<->': (a, b) => a === b,
}, { override: true });

// Function to sanitize and prepare the expression
const prepareExpression = (formula, row) => {
  let expr = formula;

  // Replace variables with their truth values
  Object.keys(row).forEach(variable => {
    if (variable !== 'Result') { // Avoid replacing 'Result' if it's a variable
      const regex = new RegExp(`\\b${variable}\\b`, 'g');
      expr = expr.replace(regex, row[variable] ? 'true' : 'false');
    }
  });

  // Replace textual operators with symbolic equivalents
  expr = expr.replace(/AND|and/gi, '&')
             .replace(/OR|or/gi, '|')
             .replace(/NOT|not/gi, '~')
             .replace(/IMPLIES|implies/gi, '->')
             .replace(/IFF|iff/gi, '<->');

  return expr;
};

export const createTruthTable = (formula) => {
  // Extract unique variables from the formula (single uppercase letters)
  const variables = Array.from(new Set(formula.match(/[A-Z]/g))).sort();

  if (variables.length === 0) {
    throw new Error('No variables found in the formula.');
  }

  const numRows = Math.pow(2, variables.length);
  const table = [];

  for (let i = 0; i < numRows; i++) {
    const row = {};
    const binary = i.toString(2).padStart(variables.length, '0');

    // Assign truth values to variables
    variables.forEach((variable, index) => {
      row[variable] = binary[index] === '1';
    });

    // Prepare the expression by replacing variables and operators
    const expr = prepareExpression(formula, row);

    // Evaluate the expression
    try {
      const result = math.evaluate(expr);
      row['Result'] = result;
    } catch (error) {
      row['Result'] = 'Error';
    }

    table.push(row);
  }

  return table;
};
