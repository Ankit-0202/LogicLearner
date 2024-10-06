// utils/truthTableGenerator.js

import { create, all } from 'mathjs';

// Initialize math.js with all functionalities
const math = create(all);

// Define custom logical functions in math.js
math.import({
  and: (a, b) => Boolean(a && b),
  or: (a, b) => Boolean(a || b),
  not: (a) => Boolean(!a),
  implies: (a, b) => Boolean(!a || b),
  iff: (a, b) => Boolean(a === b),
  xor: (a, b) => Boolean(a !== b),
}, { override: true });

// Function to add spaces between atoms and operators, while ignoring logical keywords like AND, OR, NOT
const addSpacesToFormula = (formula) => {
  return formula
    .replace(/([A-Z])(\||&|~|->|<->|\(|\))/g, '$1 $2') // Add space after atoms
    .replace(/(\||&|~|->|<->|\(|\))([A-Z])/g, '$1 $2') // Add space before atoms
    .replace(/(\||&|~|->|<->)(?![A-Za-z])/g, '$1 ')    // Ensure space after symbols if no letter follows
    .replace(/(?<![A-Za-z])(\||&|~|->|<->)/g, ' $1');  // Ensure space before symbols if no letter precedes
};

// Function to normalize operators for evaluation
const normalizeOperators = (formula) => {
  return formula
    .replace(/AND/gi, 'and')
    .replace(/OR/gi, 'or')
    .replace(/NOT/gi, 'not')
    .replace(/!/gi, 'not')
    .replace(/~/gi, 'not')
    .replace(/\|/g, 'or')
    .replace(/&/g, 'and')
    .replace(/->/g, 'implies')
    .replace(/<->/g, 'iff')
    .replace(/⊕/g, 'xor');
};

// Function to replace all operators with consistent symbols for display in the truth table
const replaceOperatorsWithSymbols = (formula) => {
  return formula
    .replace(/and/g, '∧')   // Conjunction
    .replace(/or/g, '∨')    // Disjunction
    .replace(/not/g, '¬')   // Negation
    .replace(/implies/g, '→') // Implication
    .replace(/iff/g, '↔')   // Biconditional
    .replace(/xor/g, '⊕');  // Exclusive OR
};

// Function to extract subformulae from a formula using a stack-based approach
const extractSubformulae = (formula) => {
  const stack = [];
  const subformulae = new Set(); // Use a set to avoid duplicates
  const openParenIndices = [];

  for (let i = 0; i < formula.length; i++) {
    if (formula[i] === '(') {
      stack.push('(');
      openParenIndices.push(i);
    } else if (formula[i] === ')') {
      if (stack.length > 0) {
        stack.pop();
        const openIndex = openParenIndices.pop();
        const subformula = formula.slice(openIndex + 1, i).trim(); // Extract the subformula inside parentheses
        if (subformula.length > 0) {
          subformulae.add(subformula);
        }
      }
    }
  }

  return Array.from(subformulae); // Convert Set to Array
};

// Function to sanitize and prepare the expression for evaluation
const prepareExpression = (formula, row) => {
  let expr = normalizeOperators(formula);
  Object.keys(row).forEach(variable => {
    const regex = new RegExp(`\\b${variable}\\b`, 'g');
    expr = expr.replace(regex, row[variable]);
  });
  return expr;
};

// Validation function
export const validateFormula = (formula) => {
  try {
    const spacedFormula = addSpacesToFormula(formula);
    const normalizedFormula = normalizeOperators(spacedFormula);

    // Replace variables with 'true' for validation
    const variables = Array.from(new Set(normalizedFormula.match(/[A-Z]/g)));
    let exprForValidation = normalizedFormula;
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
  const spacedFormula = addSpacesToFormula(formula);
  const validation = validateFormula(spacedFormula);
  
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const normalizedFormula = normalizeOperators(spacedFormula);
  
  // Extract variables (single uppercase letters)
  const variables = Array.from(new Set(normalizedFormula.match(/\b[A-Z]\b/g))).sort();

  if (variables.length === 0) {
    throw new Error('No variables found in the formula.');
  }

  // Extract subformulae
  const subformulae = extractSubformulae(spacedFormula);

  // Define headers: variables, subformulae, and the main formula
  const headers = [
    ...variables,
    ...subformulae.map(sub => replaceOperatorsWithSymbols(sub)), // Use symbols for subformulae
    replaceOperatorsWithSymbols(spacedFormula) // Use symbols for the main formula
  ];

  // Generate truth table
  const numRows = Math.pow(2, variables.length);
  const table = [];

  for (let i = 0; i < numRows; i++) {
    const row = {};
    const binary = i.toString(2).padStart(variables.length, '0');

    // Assign truth values to variables as 1 and 0
    variables.forEach((variable, index) => {
      row[variable] = binary[index] === '1' ? 1 : 0;
    });

    // Evaluate subformulae
    subformulae.forEach((subformula) => {
      const expr = prepareExpression(subformula, row);
      try {
        const result = math.evaluate(expr);
        row[replaceOperatorsWithSymbols(subformula)] = result ? 1 : 0;
      } catch (error) {
        row[replaceOperatorsWithSymbols(subformula)] = 'Error';
      }
    });

    // Evaluate the main formula
    const mainExpr = prepareExpression(normalizedFormula, row);
    try {
      const mainResult = math.evaluate(mainExpr);
      row[replaceOperatorsWithSymbols(spacedFormula)] = mainResult ? 1 : 0;
    } catch (error) {
      row[replaceOperatorsWithSymbols(spacedFormula)] = 'Error';
    }

    table.push(row);
  }

  return { headers, table };
};
