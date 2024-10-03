// screens/HomeScreen.js

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, TextInput, Button, Title, Paragraph, Snackbar } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  const [formula, setFormula] = useState('');
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
        <View style={styles.header}>
          <Title style={styles.title}>Propositional Logic Learner</Title>
          <Paragraph style={styles.subtitle}>
            Enter a propositional logic formula to generate its truth table.
          </Paragraph>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="Logic Formula"
            placeholder="e.g., A AND (B OR C)"
            value={formula}
            onChangeText={setFormula}
            mode="outlined"
            style={styles.input}
            autoCapitalize="characters"
          />
          <Button mode="contained" onPress={handleGenerate} style={styles.button}>
            Generate Truth Table
          </Button>
        </View>

        <View style={styles.footer}>
          <Button 
            icon="information" 
            mode="text" 
            onPress={() => navigation.navigate('Instructions')}
          >
            How It Works
          </Button>
        </View>

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
          style={{ backgroundColor: 'red' }}
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
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 40,
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
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
});

export default HomeScreen;
