import { create, all } from 'mathjs';

// Configure math.js with logical operators
const config = {
  // Custom configurations if needed
};

const math = create(all, config);

// Define logical operators if not already defined
math.import({
  AND: (a, b) => a && b,
  OR: (a, b) => a || b,
  NOT: (a) => !a,
  IMPLIES: (a, b) => !a || b,
  IFF: (a, b) => a === b,
  '∧': (a, b) => a && b,
  '∨': (a, b) => a || b,
  '¬': (a) => !a,
  '→': (a, b) => !a || b,
  '↔': (a, b) => a === b,
}, { override: true });

export const createTruthTable = (formula) => {
  // Replace logical symbols with word equivalents to match math.js functions
  let processedFormula = formula
    .replace(/∧/g, ' AND ')
    .replace(/∨/g, ' OR ')
    .replace(/¬/g, ' NOT ')
    .replace(/→/g, ' IMPLIES ')
    .replace(/↔/g, ' IFF ');

  // Extract unique variables from the formula
  const variables = Array.from(new Set(processedFormula.match(/[A-Za-z]/g))).sort();

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

    // Replace variables in the formula with their truth values
    let expr = processedFormula;
    variables.forEach((variable) => {
      const value = row[variable] ? 'true' : 'false';
      // Use word boundaries to replace only whole words
      expr = expr.replace(new RegExp(`\\b${variable}\\b`, 'g'), value);
    });

    // Evaluate the expression
    try {
      const result = math.evaluate(expr);
      row.Result = result;
    } catch (error) {
      row.Result = 'Error';
    }

    table.push(row);
  }

  return table;
};
