// screens/TruthTableScreen.js

import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
  useTheme,
  Snackbar,
  Button,
  TextInput,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { createTruthTable, validateFormula } from '../utils/truthTableGenerator';

const TruthTableScreen = ({ navigation }) => {
  const [formula, setFormula] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formulaError, setFormulaError] = useState('');

  const { colors } = useTheme();

  // Function to handle real-time formula validation
  const handleFormulaChange = (input) => {
    setFormula(input);

    // Attempt to validate the formula
    const { valid, message } = validateFormula(input);
    if (!valid) {
      setFormulaError(message);
    } else {
      setFormulaError('');
    }
  };

  // Function to handle formula submission
  const handleGenerate = () => {
    if (!formula.trim()) {
      setSnackbarMessage('Please enter a propositional logic formula.');
      setVisible(true);
      return;
    }

    if (formulaError) {
      setSnackbarMessage('Please fix the errors in the formula before generating the truth table.');
      setVisible(true);
      return;
    }

    setLoading(true);

    try {
      const { headers, table } = createTruthTable(formula);
      if (table.length === 0) {
        setSnackbarMessage('No variables found in the formula.');
        setVisible(true);
      } else {
        // Navigate to TruthTableResultScreen with headers and table data
        navigation.navigate('TruthTableResult', { headers, table, formula });
      }
    } catch (err) {
      setSnackbarMessage(err.message);
      setVisible(true);
    } finally {
      setLoading(false);
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
              <Text style={styles.title}>Truth Table Generator</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" duration={1200} delay={200} style={styles.inputContainer}>
              <TextInput
                label="Propositional Formula"
                placeholder="e.g. A AND (B OR C)"
                value={formula}
                onChangeText={handleFormulaChange}
                mode="outlined"
                style={styles.input}
                autoCapitalize="characters"
                left={<TextInput.Icon name="math-compass" />}
                accessibilityLabel="Propositional Formula Input"
                error={formulaError !== ''}
              />
              {formulaError !== '' && (
                <Text style={styles.errorTextInline}>{formulaError}</Text>
              )}
              <Button
                mode="contained"
                onPress={handleGenerate}
                style={styles.button}
                icon="table"
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                animated
                uppercase={false}
                disabled={formulaError !== '' || !formula.trim()}
              >
                Generate Truth Table
              </Button>
            </Animatable.View>

            {loading && (
              <View style={styles.loader}>
                <ActivityIndicator animating={true} color={colors.primary} size="large" />
                <Text style={[styles.loaderText, { color: colors.text }]}>Generating truth table...</Text>
              </View>
            )}

            <Animatable.View animation="fadeInUp" duration={1000} delay={300} style={styles.footer}>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Instructions')}
                style={styles.instructionsButton}
                icon="information"
                contentStyle={styles.instructionsButtonContent}
                labelStyle={styles.instructionsButtonLabel}
                animated
                uppercase={false}
              >
                How It Works
              </Button>
            </Animatable.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

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
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Adjust based on theme if necessary
  },
  innerContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    color: '#333', // Adjust based on theme
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 8,
  },
  errorTextInline: {
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginBottom: 8,
    color: '#B00020',
    fontSize: 14,
  },
  button: {
    width: '100%',
    borderRadius: 8,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    paddingTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  instructionsButton: {
    borderRadius: 8,
    width: '80%',
  },
  instructionsButtonContent: {
    height: 50,
  },
  instructionsButtonLabel: {
    fontSize: 16,
  },
  snackbar: {
    backgroundColor: '#B00020',
  },
});

export default TruthTableScreen;
