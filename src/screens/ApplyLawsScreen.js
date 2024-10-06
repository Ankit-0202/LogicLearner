// screens/ApplyLawsScreen.js

import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Animated,
  FlatList,
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

  // Dropdown state
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current; // For smooth dropdown animation

  // Handle real-time formula validation for initial formula
  const handleInitialFormulaChange = (input) => {
    setInitialFormula(input);

    // Attempt to validate the formula
    const { valid, message } = validateFormula(input);
    if (!valid) {
      setFormulaError(message);
    } else {
      setFormulaError('');
    }
  };

  // Handle real-time formula validation for new formula
  const handleNextFormulaChange = (input) => {
    setNextFormula(input);

    // Attempt to validate the formula
    const { valid, message } = validateFormula(input);
    if (!valid) {
      setFormulaError(message);
    } else {
      setFormulaError('');
    }
  };

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

    // Since we're not verifying the rule application, just add the step
    setSteps([
      ...steps,
      { formula: replaceSymbolsWithLogicalSymbols(normalizedNextFormula), rule: selectedRuleLabel() },
    ]);
    setNextFormula('');
    setSelectedRule('');
  };

  // Get the label of the selected rule
  const selectedRuleLabel = () => {
    const rule = rulesList.find((r) => r.value === selectedRule);
    return rule ? rule.label : '';
  };

  // Toggle Dropdown Visibility with Animation
  const toggleDropdown = () => {
    if (dropdownVisible) {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDropdownVisible(false));
    } else {
      setDropdownVisible(true);
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Render each rule in the dropdown table
  const renderRule = ({ item }) => (
    <TouchableOpacity
      style={styles.ruleRow}
      onPress={() => {
        setSelectedRule(item.value);
        toggleDropdown();
      }}
    >
      <Text style={styles.ruleName}>{item.label}</Text>
      <Text style={styles.ruleLogic}>{getRuleLogic(item.value)}</Text>
    </TouchableOpacity>
  );

  // Function to get the logical rule expression based on the rule value
  const getRuleLogic = (ruleValue) => {
    switch (ruleValue) {
      case 'double_negation':
        return '¬¬A ≡ A';
      case 'de_morgan':
        return '¬(A ∧ B) ≡ ¬A ∨ ¬B';
      case 'commutative':
        return 'A ∧ B ≡ B ∧ A\nA ∨ B ≡ B ∨ A';
      case 'associative':
        return '(A ∧ B) ∧ C ≡ A ∧ (B ∧ C)\n(A ∨ B) ∨ C ≡ A ∨ (B ∨ C)';
      case 'distributive':
        return 'A ∧ (B ∨ C) ≡ (A ∧ B) ∨ (A ∧ C)\nA ∨ (B ∧ C) ≡ (A ∨ B) ∧ (A ∨ C)';
      case 'idempotent':
        return 'A ∧ A ≡ A\nA ∨ A ≡ A';
      case 'excluded_middle':
        return 'A ∨ ¬A ≡ ⊤';
      case 'non_contradiction':
        return 'A ∧ ¬A ≡ ⊥';
      case 'identity':
        return 'A ∧ ⊤ ≡ A\nA ∨ ⊥ ≡ A';
      case 'domination':
        return 'A ∧ ⊥ ≡ ⊥\nA ∨ ⊤ ≡ ⊤';
      case 'implication_contrapositive':
        return 'A → B ≡ ¬B → ¬A';
      case 'implication_disjunction':
        return 'A → B ≡ ¬A ∨ B';
      default:
        return '';
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
                    onChangeText={handleInitialFormulaChange}
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
                    disabled={!initialFormula.trim() || formulaError !== ''}
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
                    onChangeText={handleNextFormulaChange}
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

                  {/* Rule Dropdown */}
                  <View style={styles.dropdownContainer}>
                    <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownHeader}>
                      <Text style={styles.dropdownHeaderText}>
                        {selectedRule ? selectedRuleLabel() : 'Select a Rule'}
                      </Text>
                      <Text style={styles.dropdownHeaderIcon}>{dropdownVisible ? '▲' : '▼'}</Text>
                    </TouchableOpacity>
                    {dropdownVisible && (
                      <Animated.View
                        style={[
                          styles.dropdownContent,
                          {
                            opacity: dropdownAnim,
                            transform: [
                              {
                                scaleY: dropdownAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, 1],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        <FlatList
                          data={rulesList}
                          renderItem={renderRule}
                          keyExtractor={(item) => item.value}
                        />
                      </Animated.View>
                    )}
                  </View>

                  <Button
                    mode="contained"
                    onPress={handleApplyRule}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                    uppercase={false}
                    disabled={!nextFormula.trim() || !selectedRule || formulaError !== ''}
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
  dropdownContainer: {
    marginBottom: 16,
    zIndex: 1, // To ensure dropdown appears above other elements
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  dropdownHeaderText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownHeaderIcon: {
    fontSize: 16,
    color: '#333',
  },
  dropdownContent: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    maxHeight: 200,
    backgroundColor: '#fff',
  },
  ruleRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ruleName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  ruleLogic: {
    flex: 1,
    fontSize: 14,
    color: '#555',
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
