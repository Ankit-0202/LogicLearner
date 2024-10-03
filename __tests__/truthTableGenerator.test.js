// __tests__/truthTableGenerator.test.js

import { createTruthTable } from '../utils/truthTableGenerator';

describe('createTruthTable', () => {
  test('generates correct truth table for A AND B', () => {
    const formula = 'A AND B';
    const table = createTruthTable(formula);
    const expected = [
      { A: false, B: false, Result: false },
      { A: false, B: true, Result: false },
      { A: true, B: false, Result: false },
      { A: true, B: true, Result: true },
    ];
    expect(table).toEqual(expected);
  });

  test('handles invalid formulas gracefully', () => {
    const formula = 'A AND OR B';
    expect(() => createTruthTable(formula)).toThrow('Invalid formula syntax.');
  });
});
