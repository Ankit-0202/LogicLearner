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

// Function to replace logical operator words with symbols for display
const replaceOperatorsWithSymbols = (f) => {
  return f.replace(/AND|and/g, '∧')
          .replace(/OR|or/g, '∨')
          .replace(/NOT|not/g, '¬')
          .replace(/IMPLIES|implies/g, '→')
          .replace(/IFF|iff/g, '↔')
          .replace(/XOR|xor/g, '⊕');
};

// Function to sanitize and prepare the expression for evaluation
const prepareExpression = (formula, row) => {
  let expr = formula;

  // Replace variables with their truth values (1 and 0)
  Object.keys(row).forEach(variable => {
    if (variable !== 'Result') { // Avoid replacing 'Result' if it's a variable
      // Use word boundaries to replace only whole words
      const regex = new RegExp(`\\b${variable}\\b`, 'g');
      expr = expr.replace(regex, row[variable] ? '1' : '0');
    }
  });

  // Replace textual operators with symbolic equivalents for evaluation
  expr = expr.replace(/AND|and/gi, '&')
             .replace(/OR|or/gi, '|')
             .replace(/NOT|not/gi, '~')
             .replace(/IMPLIES|implies/gi, '->')
             .replace(/IFF|iff/gi, '<->');

  return expr;
};

export const createTruthTable = (formula) => {
  // Extract subformulas
  const subformulas = extractSubformulas(formula);
  
  // Replace operator words with symbols for display
  const symbolizedSubformulas = subformulas.map(sub => replaceOperatorsWithSymbols(sub));
  
  // Extract unique variables from the formula (single uppercase letters)
  // Use word boundaries to match only single uppercase letters not part of words
  const variablesMatch = formula.match(/\b[A-Z]\b/g);
  const variables = variablesMatch ? Array.from(new Set(variablesMatch)).sort() : [];
  
  if (variables.length === 0) {
    throw new Error('No variables found in the formula.');
  }
  
  // Replace operator words with symbols for the main formula
  const symbolizedFormula = replaceOperatorsWithSymbols(formula);
  
  // Define headers: variables, subformulas, and the main formula
  const headers = [...variables, ...symbolizedSubformulas, symbolizedFormula];
  
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
    const mainExpr = prepareExpression(formula, row);
    try {
      const mainResult = math.evaluate(mainExpr);
      row[symbolizedFormula] = mainResult ? 1 : 0;
    } catch (error) {
      row[symbolizedFormula] = 'Error';
    }
    
    table.push(row);
  }
  
  return { headers, table };
};
