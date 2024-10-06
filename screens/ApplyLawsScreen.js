// screens/ApplyLawsScreen.js

import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  Snackbar,
  HelperText,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import jsep from 'jsep';

// Extend jsep to recognize custom operators if necessary
jsep.addBinaryOp('and', 2);
jsep.addBinaryOp('or', 1);
jsep.addBinaryOp('implies', 0.5);
jsep.addBinaryOp('iff', 0.4);
jsep.addUnaryOp('not');

// Define literals for verum and falsum
const VERUM = '⊤';
const FALSUM = '⊥';

const ApplyLawsScreen = () => {
  const { colors } = useTheme();

  // State variables
  const [steps, setSteps] = useState([]); // Each step: { formula: string, rule: string }
  const [initialFormula, setInitialFormula] = useState('');
  const [initialFormulaSet, setInitialFormulaSet] = useState(false);

  const [nextFormula, setNextFormula] = useState('');
  const [selectedRule, setSelectedRule] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [formulaError, setFormulaError] = useState('');

  // List of logical equivalence rules
  const rules = [
    { label: 'Select a Rule', value: '' },
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

  // Handle setting the initial formula
  const handleSetInitialFormula = () => {
    if (!initialFormula.trim()) {
      setFormulaError('Please enter the initial formula.');
      return;
    }

    const normalizedFormula = normalizeSymbols(initialFormula);
    const validation = validateFormula(normalizedFormula);
    if (!validation.valid) {
      setFormulaError(validation.message);
      return;
    } else {
      setFormulaError('');
    }

    setInitialFormulaSet(true);
    setSteps([{ formula: replaceSymbolsWithLogicalSymbols(normalizedFormula), rule: 'Initial Formula' }]);
  };

  // Handle applying a rule
  const handleApplyRule = () => {
    if (!nextFormula.trim()) {
      setSnackbarMessage('Please enter the new formula.');
      setVisible(true);
      return;
    }

    if (!selectedRule) {
      setSnackbarMessage('Please select a rule.');
      setVisible(true);
      return;
    }

    const normalizedNextFormula = normalizeSymbols(nextFormula);
    const validation = validateFormula(normalizedNextFormula);
    if (!validation.valid) {
      setFormulaError(validation.message);
      return;
    } else {
      setFormulaError('');
    }

    // Check if the rule is applied correctly
    const isValidTransformation = applyRule(steps[steps.length - 1].formula, normalizedNextFormula, selectedRule);

    if (isValidTransformation) {
      setSteps([
        ...steps,
        { formula: replaceSymbolsWithLogicalSymbols(normalizedNextFormula), rule: selectedRuleLabel() },
      ]);
      setNextFormula('');
      setSelectedRule('');
    } else {
      setSnackbarMessage('Incorrect application of the selected rule.');
      setVisible(true);
    }
  };

  // Get the label of the selected rule
  const selectedRuleLabel = () => {
    const rule = rules.find((r) => r.value === selectedRule);
    return rule ? rule.label : '';
  };

  // Normalize user input symbols to words
  const normalizeSymbols = (formula) => {
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

  // Replace words with logical symbols for display
  const replaceSymbolsWithLogicalSymbols = (formula) => {
    return formula
      .replace(/\band\b/g, '∧')
      .replace(/\bor\b/g, '∨')
      .replace(/\bnot\b/g, '¬')
      .replace(/\bimplies\b/g, '→')
      .replace(/\biff\b/g, '↔')
      .replace(/⊤/g, VERUM)
      .replace(/⊥/g, FALSUM);
  };

  // Validate formula using jsep
  const validateFormula = (formula) => {
    try {
      jsep(formula);
      return { valid: true };
    } catch (error) {
      return { valid: false, message: 'Invalid formula syntax.' };
    }
  };

  // Apply and verify the selected rule
  const applyRule = (fromFormula, toFormula, rule) => {
    try {
      const fromAST = jsep(fromFormula);
      const toAST = jsep(toFormula);

      switch (rule) {
        case 'double_negation':
          return checkDoubleNegation(fromAST, toAST);
        case 'de_morgan':
          return checkDeMorgan(fromAST, toAST);
        case 'commutative':
          return checkCommutative(fromAST, toAST);
        case 'associative':
          return checkAssociative(fromAST, toAST);
        case 'distributive':
          return checkDistributive(fromAST, toAST);
        case 'idempotent':
          return checkIdempotent(fromAST, toAST);
        case 'excluded_middle':
          return checkExcludedMiddle(fromAST, toAST);
        case 'non_contradiction':
          return checkNonContradiction(fromAST, toAST);
        case 'identity':
          return checkIdentity(fromAST, toAST);
        case 'domination':
          return checkDomination(fromAST, toAST);
        case 'implication_contrapositive':
          return checkImplicationContrapositive(fromAST, toAST);
        case 'implication_disjunction':
          return checkImplicationAsDisjunction(fromAST, toAST);
        default:
          return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Helper functions to check AST node types
  const isNot = (node) => node && node.type === 'UnaryExpression' && node.operator === 'not';
  const isLogicalOperator = (node, operator) => node && node.type === 'BinaryExpression' && node.operator === operator;
  const compareASTs = (node1, node2) => {
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

  // Rule-Specific Verification Functions

  // 1. Double Negation: ¬¬A ≡ A
  const checkDoubleNegation = (fromAST, toAST) => {
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

  // 2. De Morgan's Laws: ¬(A ∧ B) ≡ ¬A ∨ ¬B and ¬(A ∨ B) ≡ ¬A ∧ ¬B
  const checkDeMorgan = (fromAST, toAST) => {
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

  // 3. Commutative Law: A ∧ B ≡ B ∧ A and A ∨ B ≡ B ∨ A
  const checkCommutative = (fromAST, toAST) => {
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

  // 4. Associative Law: (A ∧ B) ∧ C ≡ A ∧ (B ∧ C) and similar for OR
  const checkAssociative = (fromAST, toAST) => {
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

  // 5. Distributive Law: A ∧ (B ∨ C) ≡ (A ∧ B) ∨ (A ∧ C) and A ∨ (B ∧ C) ≡ (A ∨ B) ∧ (A ∨ C)
  const checkDistributive = (fromAST, toAST) => {
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

  // 6. Idempotent Law: A ∧ A ≡ A and A ∨ A ≡ A
  const checkIdempotent = (fromAST, toAST) => {
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

  // 7. Law of Excluded Middle: A ∨ ¬A ≡ ⊤
  const checkExcludedMiddle = (fromAST, toAST) => {
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

  // 8. Law of Non-Contradiction: A ∧ ¬A ≡ ⊥
  const checkNonContradiction = (fromAST, toAST) => {
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

  // 9. Identity Law: A ∧ ⊤ ≡ A and A ∨ ⊥ ≡ A
  const checkIdentity = (fromAST, toAST) => {
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

  // 10. Domination Law: A ∧ ⊥ ≡ ⊥ and A ∨ ⊤ ≡ ⊤
  const checkDomination = (fromAST, toAST) => {
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

  // 11. Equivalence of an Implication and its Contrapositive: A → B ≡ ¬B → ¬A
  const checkImplicationContrapositive = (fromAST, toAST) => {
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

  // 12. Writing an Implication as a Disjunction: A → B ≡ ¬A ∨ B
  const checkImplicationAsDisjunction = (fromAST, toAST) => {
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

  // 13. Helper to check if a node is a literal with a specific symbol
  const isLiteral = (node, symbol) => node && node.type === 'Literal' && node.value === symbol;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.innerContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
              <Text style={styles.title}>Apply Logical Laws</Text>
            </Animatable.View>

            {/* Steps Table */}
            <Animatable.View animation="fadeIn" duration={1200} style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <Text style={styles.stepIndex}>{index + 1}.</Text>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepFormula}>{step.formula}</Text>
                    {index > 0 && (
                      <Text style={styles.stepRule}>({step.rule})</Text>
                    )}
                  </View>
                </View>
              ))}
            </Animatable.View>

            {/* Input Fields */}
            <Animatable.View animation="fadeInUp" duration={1000} style={styles.inputContainer}>
              {!initialFormulaSet ? (
                <>
                  <TextInput
                    label="Initial Formula"
                    placeholder="Enter the initial formula"
                    value={initialFormula}
                    onChangeText={setInitialFormula}
                    mode="outlined"
                    style={styles.input}
                    autoCapitalize="characters"
                    error={formulaError !== ''}
                  />
                  {formulaError !== '' && (
                    <HelperText type="error" visible={true}>
                      {formulaError}
                    </HelperText>
                  )}
                  <Button
                    mode="contained"
                    onPress={handleSetInitialFormula}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                    uppercase={false}
                    disabled={!initialFormula.trim()}
                  >
                    Set Initial Formula
                  </Button>
                </>
              ) : (
                <>
                  <Text style={styles.currentFormula}>
                    Current Formula: {steps[steps.length - 1].formula}
                  </Text>

                  <TextInput
                    label="New Formula"
                    placeholder="Enter the new formula"
                    value={nextFormula}
                    onChangeText={setNextFormula}
                    mode="outlined"
                    style={styles.input}
                    autoCapitalize="characters"
                  />
                  {formulaError !== '' && (
                    <HelperText type="error" visible={true}>
                      {formulaError}
                    </HelperText>
                  )}

                  {/* Rule Picker */}
                  <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>Select a Rule:</Text>
                    {rules.slice(1).map((rule) => (
                      <Button
                        key={rule.value}
                        mode={selectedRule === rule.value ? 'contained' : 'outlined'}
                        onPress={() => setSelectedRule(rule.value)}
                        style={styles.ruleButton}
                        contentStyle={styles.ruleButtonContent}
                        labelStyle={styles.ruleButtonLabel}
                      >
                        {rule.label}
                      </Button>
                    ))}
                  </View>

                  <Button
                    mode="contained"
                    onPress={handleApplyRule}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                    uppercase={false}
                    disabled={!nextFormula.trim() || !selectedRule}
                  >
                    Apply Rule
                  </Button>
                </>
              )}
            </Animatable.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* Snackbar for messages */}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => {
            setVisible(false);
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

// Styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Use theme colors if preferred
  },
  innerContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333', // Adjust based on theme
  },
  stepsContainer: {
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepIndex: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  stepFormula: {
    fontSize: 16,
    marginRight: 4,
  },
  stepRule: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 8,
  },
  currentFormula: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginBottom: 8,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  ruleButton: {
    marginBottom: 8,
  },
  ruleButtonContent: {
    height: 40,
    justifyContent: 'center',
  },
  ruleButtonLabel: {
    fontSize: 14,
  },
  button: {
    borderRadius: 8,
    marginTop: 10,
  },
  buttonContent: {
    height: 50,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default ApplyLawsScreen;
