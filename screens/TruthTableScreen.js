// screens/TruthTableScreen.js

import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Title, Paragraph, Snackbar, useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

const TruthTableScreen = ({ navigation }) => {
  const [formula, setFormula] = useState('');
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { colors } = useTheme();

  // Validation function
  const isValidFormula = (formula) => {
    // Allowed characters: uppercase letters, spaces, parentheses, logical operators (&, |, ~, ->, <->)
    const regex = /^[A-Z\s\(\)&|~\-<>]*$/;
    return regex.test(formula);
  };

  const handleGenerate = () => {
    if (!formula.trim()) {
      setSnackbarMessage('Please enter a propositional logic formula.');
      setVisible(true);
      return;
    }
    if (!isValidFormula(formula)) {
      setSnackbarMessage('Invalid formula syntax. Use only uppercase letters and allowed operators.');
      setVisible(true);
      return;
    }
    // Navigate to TruthTableResultScreen with the formula as a parameter
    navigation.navigate('TruthTableResult', { formula });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.header}>
          <Title style={styles.title}>Generate Truth Table</Title>
          <Paragraph style={styles.subtitle}>
            Enter a propositional logic formula to generate its truth table.
          </Paragraph>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1200} delay={200} style={styles.inputContainer}>
          <TextInput
            label="Logic Formula"
            placeholder="e.g., A AND (B OR C)"
            value={formula}
            onChangeText={setFormula}
            mode="outlined"
            style={styles.input}
            autoCapitalize="characters"
            left={<TextInput.Icon name="math-compass" />}
          />
          <Button 
            mode="contained" 
            onPress={handleGenerate} 
            style={styles.button}
            icon="table"
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            animated
            uppercase={false}
          >
            Generate Truth Table
          </Button>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1400} delay={400} style={styles.footer}>
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('Instructions')}
            style={styles.instructionsButton}
            icon="information"
            uppercase={false}
          >
            How It Works
          </Button>
        </Animatable.View>

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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
    padding: 5,
    borderRadius: 8,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  instructionsButton: {
    alignSelf: 'center',
  },
  snackbar: {
    backgroundColor: '#B00020',
  },
});

export default TruthTableScreen;
