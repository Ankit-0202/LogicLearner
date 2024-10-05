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
import { validateFormula } from '../utils/truthTableGenerator'; // Assuming a validate function exists

const ApplyLawsScreen = () => {
  const { colors } = useTheme();

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
    { label: 'De Morgan\'s Law', value: 'de_morgan' },
    { label: 'Commutative Law', value: 'commutative' },
    { label: 'Associative Law', value: 'associative' },
    { label: 'Distributive Law', value: 'distributive' },
  ];

  const handleSetInitialFormula = () => {
    if (!initialFormula.trim()) {
      setFormulaError('Please enter the initial formula.');
      return;
    }

    const validation = validateFormula(initialFormula);
    if (!validation.valid) {
      setFormulaError(validation.message);
      return;
    } else {
      setFormulaError('');
    }

    setInitialFormulaSet(true);
    setSteps([{ formula: initialFormula, rule: 'Initial Formula' }]);
  };

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

    // Check if the rule is applied correctly
    const isValidTransformation = applyRule(steps[steps.length - 1].formula, nextFormula, selectedRule);

    if (isValidTransformation) {
      setSteps([...steps, { formula: nextFormula, rule: selectedRuleLabel() }]);
      setNextFormula('');
      setSelectedRule('');
    } else {
      setSnackbarMessage('Incorrect application of the selected rule.');
      setVisible(true);
    }
  };

  const selectedRuleLabel = () => {
    const rule = rules.find(r => r.value === selectedRule);
    return rule ? rule.label : '';
  };

  // Function to apply the selected rule and verify if the transformation is valid
  const applyRule = (fromFormula, toFormula, rule) => {
    switch (rule) {
      case 'double_negation':
        return checkDoubleNegation(fromFormula, toFormula);
      case 'de_morgan':
        return checkDeMorgan(fromFormula, toFormula);
      case 'commutative':
        return checkCommutative(fromFormula, toFormula);
      case 'associative':
        return checkAssociative(fromFormula, toFormula);
      case 'distributive':
        return checkDistributive(fromFormula, toFormula);
      default:
        return false;
    }
  };

  // Rule-Specific Verification Logic

  const checkDoubleNegation = (from, to) => {
    // Apply Double Negation rule: ¬¬A ≡ A
    const normFrom = normalizeFormula(from);
    const normTo = normalizeFormula(to);

    return normFrom === `not not ${normTo}` || `not not ${normFrom}` === normTo;
  };

  const checkDeMorgan = (from, to) => {
    // Apply De Morgan's Law
    const normFrom = normalizeFormula(from);
    const normTo = normalizeFormula(to);

    // Handle patterns for De Morgan's
    const deMorganPatterns = [
      {
        from: /^not\s+\(\s*(.+)\s+and\s+(.+)\s*\)$/i,
        to: /^\(\s*not\s+\1\s+or\s+not\s+\2\s*\)$/i,
      },
      {
        from: /^not\s+\(\s*(.+)\s+or\s+(.+)\s*\)$/i,
        to: /^\(\s*not\s+\1\s+and\s+not\s+\2\s*\)$/i,
      },
    ];

    for (let pattern of deMorganPatterns) {
      const matchFrom = normFrom.match(pattern.from);
      const matchTo = normTo.match(pattern.to);
      if (matchFrom && matchTo) {
        return matchFrom[1] === matchTo[1] && matchFrom[2] === matchTo[2];
      }

      // Check reverse
      const reverseMatchFrom = normTo.match(pattern.from);
      const reverseMatchTo = normFrom.match(pattern.to);
      if (reverseMatchFrom && reverseMatchTo) {
        return reverseMatchFrom[1] === reverseMatchTo[1] && reverseMatchFrom[2] === reverseMatchTo[2];
      }
    }

    return false;
  };

  const checkCommutative = (from, to) => {
    // Apply Commutative Law: A AND B ≡ B AND A or A OR B ≡ B OR A
    const normFrom = normalizeFormula(from);
    const normTo = normalizeFormula(to);

    const commutativePattern = /^(.+)\s+(and|or)\s+(.+)$/i;
    const matchFrom = normFrom.match(commutativePattern);
    const matchTo = normTo.match(commutativePattern);

    if (matchFrom && matchTo) {
      return matchFrom[2] === matchTo[2] && (
        (matchFrom[1] === matchTo[3] && matchFrom[3] === matchTo[1]) ||
        (matchFrom[1] === matchTo[1] && matchFrom[3] === matchTo[3])
      );
    }

    return false;
  };

  const checkAssociative = (from, to) => {
    // Apply Associative Law: (A AND B) AND C ≡ A AND (B AND C)
    const normFrom = normalizeFormula(from);
    const normTo = normalizeFormula(to);

    const associativePattern = /^\(\s*(.+)\s+(and|or)\s+(.+)\s*\)\s+\2\s+(.+)$/i;
    const matchFrom = normFrom.match(associativePattern);
    const matchTo = normTo.match(associativePattern);

    if (matchFrom && matchTo) {
      return matchFrom[1] === matchTo[1] && matchFrom[3] === matchTo[3] && matchFrom[4] === matchTo[2];
    }

    return false;
  };

  const checkDistributive = (from, to) => {
    // Apply Distributive Law: A AND (B OR C) ≡ (A AND B) OR (A AND C)
    const normFrom = normalizeFormula(from);
    const normTo = normalizeFormula(to);

    const distributivePatterns = [
      {
        from: /^(.+)\s+and\s+\(\s*(.+)\s+or\s+(.+)\s*\)$/i,
        to: /^\(\s*\1\s+and\s+\2\s*\)\s+or\s+\(\s*\1\s+and\s+\3\s*\)$/i,
      },
      {
        from: /^(.+)\s+or\s+\(\s*(.+)\s+and\s+(.+)\s*\)$/i,
        to: /^\(\s*\1\s+or\s+\2\s*\)\s+and\s+\(\s*\1\s+or\s+\3\s*\)$/i,
      },
    ];

    for (let pattern of distributivePatterns) {
      const matchFrom = normFrom.match(pattern.from);
      const matchTo = normTo.match(pattern.to);
      if (matchFrom && matchTo) {
        return matchFrom[1] === matchTo[1] && matchFrom[2] === matchTo[2] && matchFrom[3] === matchTo[3];
      }

      // Check reverse
      const reverseMatchFrom = normTo.match(pattern.from);
      const reverseMatchTo = normFrom.match(pattern.to);
      if (reverseMatchFrom && reverseMatchTo) {
        return reverseMatchFrom[1] === reverseMatchTo[1] && reverseMatchFrom[2] === reverseMatchTo[2] && reverseMatchFrom[3] === reverseMatchTo[3];
      }
    }

    return false;
  };

  const normalizeFormula = (formula) => {
    // Normalize by converting to lowercase, removing extra spaces
    return formula.replace(/\s+/g, ' ').trim().toLowerCase();
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
                    disabled={
                      !nextFormula.trim() ||
                      !selectedRule
                    }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepFormula: {
    fontSize: 16,
    marginHorizontal: 4,
  },
  stepArrow: {
    fontSize: 16,
    marginHorizontal: 4,
  },
  stepRule: {
    fontSize: 14,
    fontStyle: 'italic',
    marginLeft: 8,
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
  },
  pickerContainer: {
    marginBottom: 8,
  },
  menuButton: {
    width: '100%',
    borderRadius: 4,
  },
  menuButtonContent: {
    height: 50,
    justifyContent: 'space-between',
  },
  menuButtonLabel: {
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    marginTop: 10,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default ApplyLawsScreen;
