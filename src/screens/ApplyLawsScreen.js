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
  ActivityIndicator,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

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

  // Loading state for CSV sharing
  const [isSharing, setIsSharing] = useState(false);

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

    // Apply symbol replacements
    const formattedFormula = replaceSymbolsWithLogicalSymbols(normalizedFormula);

    setInitialFormulaSet(true);
    setSteps([{ formula: formattedFormula, rule: 'Initial Formula' }]);
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

    // Apply symbol replacements
    const formattedNextFormula = replaceSymbolsWithLogicalSymbols(normalizedNextFormula);

    // Since we're not verifying the rule application, just add the step
    setSteps([
      ...steps,
      { formula: formattedNextFormula, rule: selectedRuleLabel() },
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

  // Function to generate CSV content from steps
  const generateCSV = () => {
    const header = ['Step', 'Formula', 'Applied Law'];
    const rows = steps.map((step, index) => [
      index + 1,
      `"${step.formula}"`, // Encapsulate in quotes to handle commas within formulas
      `"${step.rule}"`,
    ]);
    const csvContent = [header, ...rows].map((e) => e.join(',')).join('\n');
    return csvContent;
  };

  // Function to handle CSV download and sharing
  const handleDownloadCSV = async () => {
    if (steps.length === 0) {
      setSnackbarMessage('No steps to export.');
      setVisible(true);
      return;
    }

    setIsSharing(true);

    const csv = generateCSV();
    const path = `${RNFS.DocumentDirectoryPath}/LogicalSteps.csv`;

    try {
      // Write the CSV string to a file
      await RNFS.writeFile(path, csv, 'utf8');
      console.log('CSV file written to:', path);

      // Share the file
      const shareOptions = {
        title: 'Share Logical Steps',
        url: `file://${path}`,
        type: 'text/csv',
        filename: 'LogicalSteps', // for iOS
      };

      await Share.open(shareOptions);

      // Optionally delete the file after sharing
      // await RNFS.unlink(path);
      // console.log('CSV file deleted from:', path);
    } catch (error) {
      console.error('Error generating or sharing CSV:', error);
      setSnackbarMessage('Failed to export CSV.');
      setVisible(true);
    } finally {
      setIsSharing(false);
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
            {steps.length > 0 && (
              <Animatable.View animation="fadeIn" duration={1200} style={styles.tableContainer}>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCellStep, styles.tableHeaderText]}>Step</Text>
                  <Text style={[styles.tableCellFormula, styles.tableHeaderText]}>Formula</Text>
                  <Text style={[styles.tableCellRule, styles.tableHeaderText]}>Applied Law</Text>
                </View>

                {/* Table Rows */}
                <FlatList
                  data={steps}
                  renderItem={({ item, index }) => (
                    <View style={styles.tableRow} key={index}>
                      <Text style={styles.tableCellStep}>{index + 1}</Text>
                      <Text style={styles.tableCellFormula}>{item.formula}</Text>
                      <Text style={styles.tableCellRule}>{item.rule}</Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </Animatable.View>
            )}

            {/* Download CSV Button */}
            {steps.length > 0 && (
              <Animatable.View animation="fadeInUp" duration={1000} style={styles.downloadButtonContainer}>
                <Button
                  mode="outlined"
                  onPress={handleDownloadCSV}
                  style={styles.downloadButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  uppercase={false}
                  icon="download"
                  accessibilityLabel="Download Steps as CSV"
                  accessibilityHint="Downloads the steps table as a CSV file which can be shared via various platforms."
                  disabled={isSharing}
                >
                  Download as CSV
                </Button>
              </Animatable.View>
            )}

            {/* Display Loading Indicator When Sharing */}
            {isSharing && (
              <View style={styles.loader}>
                <ActivityIndicator animating={true} color={colors.primary} size="large" />
                <Text style={[styles.loaderText, { color: colors.text }]}>Preparing CSV...</Text>
              </View>
            )}

            {/* Input Fields */}
            <Animatable.View animation="fadeInUp" duration={1000} style={styles.inputContainer}>
              {!initialFormulaSet ? (
                <>
                  <TextInput
                    label="Initial Formula"
                    placeholder="Enter the initial formula (e.g. A ∧ B)"
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
  tableContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCellStep: {
    flex: 0.8, // Slightly narrower
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    textAlign: 'center',
    fontSize: 16,
  },
  tableCellFormula: {
    flex: 2, // Wider
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    textAlign: 'center',
    fontSize: 16,
  },
  tableCellRule: {
    flex: 2, // Wider
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  downloadButtonContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  downloadButton: {
    width: '60%',
    borderRadius: 8,
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
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -50 }],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    borderRadius: 10,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
});

export default ApplyLawsScreen;
