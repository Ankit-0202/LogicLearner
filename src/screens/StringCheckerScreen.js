// src/screens/StringCheckerScreen.js

import React, { useState } from 'react';
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, Button, TextInput, List, useTheme, Snackbar } from 'react-native-paper';
import RegexInput from '../components/RegexInput';
import * as Animatable from 'react-native-animatable';
import { validateRegex } from '../utils/regexUtils';

const StringCheckerScreen = () => {
  const { colors } = useTheme();

  // State variables
  const [regex, setRegex] = useState('');
  const [stringsInput, setStringsInput] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Handle string checking
  const handleCheckStrings = () => {
    // Validate regex
    const { valid, message } = validateRegex(regex);
    if (!valid) {
      setError(message);
      setSnackbarVisible(true);
      return;
    }

    // Split input strings by newline and trim whitespace
    // Treat 'ε' as empty string
    const strings = stringsInput.split('\n').map(s => s.trim()).filter(s => s.length > 0 || s === 'ε');

    if (strings.length === 0) {
      setError('Please enter at least one string to check.');
      setSnackbarVisible(true);
      return;
    }

    try {
      // Create a RegExp object
      const pattern = new RegExp(`^${regex}$`); // Ensure full string match

      const checkResults = strings.map((str, index) => {
        const actualString = str === 'ε' ? '' : str;
        return {
          id: index.toString(),
          string: str, // Display 'ε' instead of ''
          isValid: pattern.test(actualString),
        };
      });

      setResults(checkResults);
      setError('');
    } catch (err) {
      console.error('Error creating RegExp:', err);
      setError('Invalid regex pattern.');
      setSnackbarVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.innerContainer}>
          <Text style={styles.heading}>String Checker</Text>

          {/* Regex Input */}
          <RegexInput regex={regex} setRegex={setRegex} />

          {/* Strings Input */}
          <TextInput
            label="Enter Strings (one per line)"
            placeholder={`e.g.\nabc\nac\nbc\nε`}
            value={stringsInput}
            onChangeText={setStringsInput}
            mode="outlined"
            multiline
            numberOfLines={5}
            style={styles.input}
            accessibilityLabel="Strings Input Field"
            accessibilityHint="Enter multiple strings separated by newlines to check against the regex. Use 'ε' for the empty string."
          />

          {/* Check Button */}
          <Button
            mode="contained"
            onPress={handleCheckStrings}
            style={styles.button}
            icon="check"
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            uppercase={false}
            accessibilityLabel="Check Strings Button"
            accessibilityHint="Checks each entered string against the provided regex"
          >
            Check Strings
          </Button>

          {/* Display Results */}
          {results.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Results:</Text>
              <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <List.Item
                    title={item.string}
                    left={() => (
                      <List.Icon
                        icon={item.isValid ? 'check-circle' : 'close-circle'}
                        color={item.isValid ? 'green' : 'red'}
                      />
                    )}
                    titleStyle={styles.resultText}
                  />
                )}
                style={styles.list}
              />
            </View>
          )}
        </Animatable.View>
      </TouchableWithoutFeedback>

      {/* Snackbar for Errors */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    color: '#6200ee',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  buttonContent: {
    height: 50,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 18,
  },
  resultsContainer: {
    marginTop: 30,
    flex: 1,
  },
  resultsTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 16,
  },
  list: {
    maxHeight: 300, // Adjust as needed for scrollable list
  },
});

export default StringCheckerScreen;
