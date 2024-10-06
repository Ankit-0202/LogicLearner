// utils/logicalUtils.js

import jsep from 'jsep';

// Extend jsep to recognize custom operators if necessary
jsep.addBinaryOp('and', 2);
jsep.addBinaryOp('or', 1);
jsep.addBinaryOp('implies', 0.5);
jsep.addBinaryOp('iff', 0.4);
jsep.addUnaryOp('not');

// Define literals for verum and falsum
export const VERUM = '⊤';
export const FALSUM = '⊥';

// List of logical equivalence rules
export const rulesList = [
  { label: 'Double Negation', value: 'double_negation' },
  { label: "De Morgan's Law", value: 'de_morgan' },
  { label: 'Commutative Law', value: 'commutative' },
  { label: 'Associative Law', value: 'associative' },
  { label: 'Distributive Law', value: 'distributive' },
  { label: 'Idempotent Law', value: 'idempotent' },
  { label: 'Law of Excluded Middle', value: 'excluded_middle' },
  { label: 'Law of Non-Contradiction', value: 'non_contradiction' },
  { label: 'Identity Law', value: 'identity' },
  { label: 'Domination Law', value: 'domination' },
  { label: 'Implication and Contrapositive', value: 'implication_contrapositive' },
  { label: 'Implication as Disjunction', value: 'implication_disjunction' },
];

// Helper Functions

/**
 * Normalize user input symbols to words.
 * Replaces symbols like |, &, ~, ¬, →, ↔ with their textual equivalents.
 * Ensures that verum (⊤) and falsum (⊥) are preserved.
 * @param {string} formula
 * @returns {string}
 */
export const normalizeSymbols = (formula) => {
  return formula
    .replace(/¬/g, 'not')
    .replace(/~(?=\s|$)/g, 'not') // Replace ~ with not only if followed by space or end
    .replace(/\|/g, 'or')
    .replace(/&/g, 'and')
    .replace(/→/g, 'implies')
    .replace(/↔/g, 'iff')
    .replace(new RegExp(VERUM, 'g'), '⊤') // Ensure verum is preserved
    .replace(new RegExp(FALSUM, 'g'), '⊥'); // Ensure falsum is preserved
};

/**
 * Replace words with logical symbols for display.
 * Converts 'and', 'or', 'not', 'implies', 'iff' to their respective symbols.
 * Also replaces verum and falsum symbols appropriately.
 * @param {string} formula
 * @returns {string}
 */
export const replaceSymbolsWithLogicalSymbols = (formula) => {
  return formula
    .replace(/\band\b/g, '∧')
    .replace(/\bor\b/g, '∨')
    .replace(/\bnot\b/g, '¬')
    .replace(/\bimplies\b/g, '→')
    .replace(/\biff\b/g, '↔')
    .replace(/⊤/g, VERUM)
    .replace(/⊥/g, FALSUM);
};

/**
 * Validate formula using jsep parser.
 * @param {string} formula
 * @returns {{valid: boolean, message?: string}}
 */
export const validateFormula = (formula) => {
  try {
    jsep(formula);
    return { valid: true };
  } catch (error) {
    return { valid: false, message: 'Invalid formula syntax.' };
  }
};

/**
 * Compare two AST nodes for structural equality.
 * @param {object} node1
 * @param {object} node2
 * @returns {boolean}
 */
export const compareASTs = (node1, node2) => {
  if (node1.type !== node2.type) return false;
  if (node1.type === 'Literal') {
    return node1.value === node2.value;
  }
  if (node1.type === 'UnaryExpression') {
    return node1.operator === node2.operator && compareASTs(node1.argument, node2.argument);
  }
  if (node1.type === 'BinaryExpression') {
    return (
      node1.operator === node2.operator &&
      compareASTs(node1.left, node2.left) &&
      compareASTs(node1.right, node2.right)
    );
  }
  return false;
};

/**
 * Check if a node is a NOT operation.
 * @param {object} node
 * @returns {boolean}
 */
export const isNot = (node) => node && node.type === 'UnaryExpression' && node.operator === 'not';

/**
 * Check if a node is a specific logical operator.
 * @param {object} node
 * @param {string} operator - 'and', 'or', 'implies', 'iff'
 * @returns {boolean}
 */
export const isLogicalOperator = (node, operator) =>
  node && node.type === 'BinaryExpression' && node.operator === operator;

/**
 * Check if a node is a literal with a specific symbol.
 * @param {object} node
 * @param {string} symbol - '⊤' or '⊥'
 * @returns {boolean}
 */
export const isLiteral = (node, symbol) => node && node.type === 'Literal' && node.value === symbol;

// Rule Verification Functions

export const checkDoubleNegation = (fromAST, toAST) => {
  // from: ¬¬A to: A
  if (isNot(fromAST) && isNot(fromAST.argument) && compareASTs(fromAST.argument.argument, toAST)) {
    return true;
  }
  // from: A to: ¬¬A
  if (isNot(toAST) && isNot(toAST.argument) && compareASTs(fromAST, toAST.argument.argument)) {
    return true;
  }
  return false;
};

export const checkDeMorgan = (fromAST, toAST) => {
  // ¬(A ∧ B) ≡ ¬A ∨ ¬B
  if (
    isNot(fromAST) &&
    isLogicalOperator(fromAST.argument, 'and') &&
    isLogicalOperator(toAST, 'or') &&
    isNot(toAST.left) &&
    isNot(toAST.right) &&
    compareASTs(fromAST.argument.left.argument, toAST.left.argument) &&
    compareASTs(fromAST.argument.right.argument, toAST.right.argument)
  ) {
    return true;
  }

  // ¬(A ∨ B) ≡ ¬A ∧ ¬B
  if (
    isNot(fromAST) &&
    isLogicalOperator(fromAST.argument, 'or') &&
    isLogicalOperator(toAST, 'and') &&
    isNot(toAST.left) &&
    isNot(toAST.right) &&
    compareASTs(fromAST.argument.left.argument, toAST.left.argument) &&
    compareASTs(fromAST.argument.right.argument, toAST.right.argument)
  ) {
    return true;
  }

  return false;
};

export const checkCommutative = (fromAST, toAST) => {
  if (
    isLogicalOperator(fromAST, fromAST.operator) &&
    isLogicalOperator(toAST, toAST.operator) &&
    fromAST.operator === toAST.operator &&
    compareASTs(fromAST.left, toAST.right) &&
    compareASTs(fromAST.right, toAST.left)
  ) {
    return true;
  }
  return false;
};

export const checkAssociative = (fromAST, toAST) => {
  // (A ∧ B) ∧ C ≡ A ∧ (B ∧ C)
  if (
    isLogicalOperator(fromAST, fromAST.operator) &&
    isLogicalOperator(fromAST.left, fromAST.operator) &&
    isLogicalOperator(toAST, toAST.operator) &&
    isLogicalOperator(toAST.right, toAST.operator) &&
    compareASTs(fromAST.left.left, toAST.left) &&
    compareASTs(fromAST.left.right, toAST.right.left) &&
    compareASTs(fromAST.right, toAST.right.right)
  ) {
    return true;
  }

  // (A ∨ B) ∨ C ≡ A ∨ (B ∨ C)
  if (
    isLogicalOperator(fromAST, fromAST.operator) &&
    isLogicalOperator(fromAST.left, fromAST.operator) &&
    isLogicalOperator(toAST, toAST.operator) &&
    isLogicalOperator(toAST.right, toAST.operator) &&
    compareASTs(fromAST.left.left, toAST.left) &&
    compareASTs(fromAST.left.right, toAST.right.left) &&
    compareASTs(fromAST.right, toAST.right.right)
  ) {
    return true;
  }

  return false;
};

export const checkDistributive = (fromAST, toAST) => {
  // A ∧ (B ∨ C) ≡ (A ∧ B) ∨ (A ∧ C)
  if (
    isLogicalOperator(fromAST, 'and') &&
    isLogicalOperator(fromAST.right, 'or') &&
    isLogicalOperator(toAST, 'or') &&
    isLogicalOperator(toAST.left, 'and') &&
    isLogicalOperator(toAST.right, 'and') &&
    compareASTs(fromAST.left, toAST.left.left) &&
    compareASTs(fromAST.right.left, toAST.left.right) &&
    compareASTs(fromAST.left, toAST.right.left) &&
    compareASTs(fromAST.right.right, toAST.right.right)
  ) {
    return true;
  }

  // A ∨ (B ∧ C) ≡ (A ∨ B) ∧ (A ∨ C)
  if (
    isLogicalOperator(fromAST, 'or') &&
    isLogicalOperator(fromAST.right, 'and') &&
    isLogicalOperator(toAST, 'and') &&
    isLogicalOperator(toAST.left, 'or') &&
    isLogicalOperator(toAST.right, 'or') &&
    compareASTs(fromAST.left, toAST.left.left) &&
    compareASTs(fromAST.right.left, toAST.left.right) &&
    compareASTs(fromAST.left, toAST.right.left) &&
    compareASTs(fromAST.right.right, toAST.right.right)
  ) {
    return true;
  }

  return false;
};

export const checkIdempotent = (fromAST, toAST) => {
  // A ∧ A ≡ A
  if (
    isLogicalOperator(fromAST, 'and') &&
    compareASTs(fromAST.left, fromAST.right) &&
    compareASTs(fromAST.left, toAST)
  ) {
    return true;
  }

  // A ∨ A ≡ A
  if (
    isLogicalOperator(fromAST, 'or') &&
    compareASTs(fromAST.left, fromAST.right) &&
    compareASTs(fromAST.left, toAST)
  ) {
    return true;
  }

  // Reverse: A ≡ A ∧ A or A ≡ A ∨ A
  if (
    isLogicalOperator(toAST, 'and') &&
    compareASTs(toAST.left, toAST.right) &&
    compareASTs(fromAST, toAST.left)
  ) {
    return true;
  }

  if (
    isLogicalOperator(toAST, 'or') &&
    compareASTs(toAST.left, toAST.right) &&
    compareASTs(fromAST, toAST.left)
  ) {
    return true;
  }

  return false;
};

export const checkExcludedMiddle = (fromAST, toAST) => {
  // A ∨ ¬A ≡ ⊤
  if (
    isLogicalOperator(fromAST, 'or') &&
    ((compareASTs(fromAST.left, toAST) && isNot(fromAST.right)) ||
      (compareASTs(fromAST.right, toAST) && isNot(fromAST.left)))
  ) {
    return true;
  }

  // From A ∨ ¬A to ⊤
  if (
    isLogicalOperator(fromAST, 'or') &&
    ((isNot(fromAST.left) && compareASTs(fromAST.right, toAST)) ||
      (isNot(fromAST.right) && compareASTs(fromAST.left, toAST)))
  ) {
    return true;
  }

  return false;
};

export const checkNonContradiction = (fromAST, toAST) => {
  // A ∧ ¬A ≡ ⊥
  if (
    isLogicalOperator(fromAST, 'and') &&
    ((isNot(fromAST.left) && compareASTs(fromAST.right, toAST)) ||
      (isNot(fromAST.right) && compareASTs(fromAST.left, toAST)))
  ) {
    return true;
  }

  // From A ∧ ¬A to ⊥
  if (
    isLogicalOperator(fromAST, 'and') &&
    ((isNot(fromAST.left) && compareASTs(fromAST.right, toAST)) ||
      (isNot(fromAST.right) && compareASTs(fromAST.left, toAST)))
  ) {
    return true;
  }

  return false;
};

export const checkIdentity = (fromAST, toAST) => {
  // A ∧ ⊤ ≡ A
  if (
    isLogicalOperator(fromAST, 'and') &&
    (isLiteral(fromAST.right, VERUM) || isLiteral(fromAST.left, VERUM)) &&
    compareASTs(isLiteral(fromAST.left, VERUM) ? fromAST.right : fromAST.left, toAST)
  ) {
    return true;
  }

  // A ∨ ⊥ ≡ A
  if (
    isLogicalOperator(fromAST, 'or') &&
    (isLiteral(fromAST.right, FALSUM) || isLiteral(fromAST.left, FALSUM)) &&
    compareASTs(isLiteral(fromAST.left, FALSUM) ? fromAST.right : fromAST.left, toAST)
  ) {
    return true;
  }

  // Reverse: A ≡ A ∧ ⊤ or A ≡ A ∨ ⊥
  if (
    isLogicalOperator(toAST, 'and') &&
    (isLiteral(toAST.right, VERUM) || isLiteral(toAST.left, VERUM)) &&
    compareASTs(fromAST, isLiteral(toAST.left, VERUM) ? toAST.right : toAST.left)
  ) {
    return true;
  }

  if (
    isLogicalOperator(toAST, 'or') &&
    (isLiteral(toAST.right, FALSUM) || isLiteral(toAST.left, FALSUM)) &&
    compareASTs(fromAST, isLiteral(toAST.left, FALSUM) ? toAST.right : toAST.left)
  ) {
    return true;
  }

  return false;
};

export const checkDomination = (fromAST, toAST) => {
  // A ∧ ⊥ ≡ ⊥
  if (
    isLogicalOperator(fromAST, 'and') &&
    (isLiteral(fromAST.left, FALSUM) || isLiteral(fromAST.right, FALSUM)) &&
    compareASTs(isLiteral(fromAST.left, FALSUM) ? fromAST.left : fromAST.right, toAST)
  ) {
    return true;
  }

  // A ∨ ⊤ ≡ ⊤
  if (
    isLogicalOperator(fromAST, 'or') &&
    (isLiteral(fromAST.left, VERUM) || isLiteral(fromAST.right, VERUM)) &&
    compareASTs(isLiteral(fromAST.left, VERUM) ? fromAST.left : fromAST.right, toAST)
  ) {
    return true;
  }

  // Reverse: ⊥ ≡ A ∧ ⊥ and ⊤ ≡ A ∨ ⊤
  if (
    isLogicalOperator(toAST, 'and') &&
    (isLiteral(toAST.left, FALSUM) || isLiteral(toAST.right, FALSUM)) &&
    compareASTs(fromAST, isLiteral(toAST.left, FALSUM) ? toAST.left : toAST.right)
  ) {
    return true;
  }

  if (
    isLogicalOperator(toAST, 'or') &&
    (isLiteral(toAST.left, VERUM) || isLiteral(toAST.right, VERUM)) &&
    compareASTs(fromAST, isLiteral(toAST.left, VERUM) ? toAST.left : toAST.right)
  ) {
    return true;
  }

  return false;
};

export const checkImplicationContrapositive = (fromAST, toAST) => {
  // from: A → B to: ¬B → ¬A
  if (
    isLogicalOperator(fromAST, 'implies') &&
    isNot(fromAST.right) &&
    isNot(fromAST.left) &&
    isLogicalOperator(toAST, 'implies') &&
    compareASTs(fromAST.left.argument, toAST.right.argument) &&
    compareASTs(fromAST.right.argument, toAST.left.argument)
  ) {
    return true;
  }

  // Reverse: ¬B → ¬A to A → B
  if (
    isLogicalOperator(toAST, 'implies') &&
    isNot(toAST.right) &&
    isNot(toAST.left) &&
    isLogicalOperator(fromAST, 'implies') &&
    compareASTs(toAST.left.argument, fromAST.right.argument) &&
    compareASTs(toAST.right.argument, fromAST.left.argument)
  ) {
    return true;
  }

  return false;
};

export const checkImplicationAsDisjunction = (fromAST, toAST) => {
  // from: A → B to: ¬A ∨ B
  if (
    isLogicalOperator(fromAST, 'implies') &&
    isNot(fromAST.left) &&
    isLogicalOperator(toAST, 'or') &&
    compareASTs(fromAST.left.argument, toAST.left.argument) &&
    compareASTs(fromAST.right, toAST.right.argument)
  ) {
    return true;
  }

  // from: ¬A ∨ B to: A → B
  if (
    isLogicalOperator(toAST, 'implies') &&
    isNot(toAST.left) &&
    isLogicalOperator(fromAST, 'or') &&
    compareASTs(toAST.left.argument, fromAST.left.argument) &&
    compareASTs(toAST.right.argument, fromAST.right.argument)
  ) {
    return true;
  }

  return false;
};
