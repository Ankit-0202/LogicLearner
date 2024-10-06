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

// Import utilities from logicalUtils.js
import {
  VERUM,
  FALSUM,
  rulesList,
  normalizeSymbols,
  replaceSymbolsWithLogicalSymbols,
  validateFormula,
  compareASTs,
  isNot,
  isLogicalOperator,
  isLiteral,
  checkDoubleNegation,
  checkDeMorgan,
  checkCommutative,
  checkAssociative,
  checkDistributive,
  checkIdempotent,
  checkExcludedMiddle,
  checkNonContradiction,
  checkIdentity,
  checkDomination,
  checkImplicationContrapositive,
  checkImplicationAsDisjunction,
} from '../utils/logicalUtils';

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
    const rule = rulesList.find((r) => r.value === selectedRule);
    return rule ? rule.label : '';
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
                    placeholder="Enter the initial formula (e.g., A ∧ B)"
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
                    {rulesList.slice(1).map((rule) => (
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
