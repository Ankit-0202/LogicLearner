// screens/HomeScreen.js

import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, TextInput, Button, Title, Paragraph, Snackbar, IconButton } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [formula, setFormula] = useState('');
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const theme = useTheme();

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
    navigation.navigate('TruthTable', { formula });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Title style={styles.title}>Propositional Logic Learner</Title>
        <Paragraph style={styles.subtitle}>
          Enter a propositional logic formula to generate its truth table.
        </Paragraph>

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
        >
          Generate Truth Table
        </Button>

        <Button 
          mode="text" 
          onPress={() => navigation.navigate('Instructions')}
          style={styles.instructionsButton}
          icon="information"
        >
          How It Works
        </Button>

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
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
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
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    padding: 5,
    marginBottom: 10,
  },
  instructionsButton: {
    alignSelf: 'center',
  },
  snackbar: {
    backgroundColor: '#B00020',
  },
});

export default HomeScreen;
