// src/screens/StringGeneratorScreen.js

import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { Text, Button, TextInput, List, useTheme } from 'react-native-paper';
import RegexInput from '../components/RegexInput';
import RandExp from 'randexp';
import * as Animatable from 'react-native-animatable';
import { validateRegex } from '../utils/regexUtils';

const StringGeneratorScreen = () => {
  const { colors } = useTheme();

  // State variables
  const [regex, setRegex] = useState('');
  const [minLength, setMinLength] = useState('');
  const [maxLength, setMaxLength] = useState('');
  const [numberOfStrings, setNumberOfStrings] = useState('');
  const [generatedStrings, setGeneratedStrings] = useState([]);
  const [error, setError] = useState('');

  // Handle string generation
  const handleGenerateStrings = () => {
    // Validate input fields
    if (!regex) {
      Alert.alert('Error', 'Please enter a valid regex.');
      return;
    }

    const { valid, message } = validateRegex(regex);
    if (!valid) {
      Alert.alert('Invalid Regex', message);
      return;
    }

    const num = parseInt(numberOfStrings);
    const min = parseInt(minLength);
    const max = parseInt(maxLength);

    if (isNaN(num) || num <= 0) {
      Alert.alert('Invalid Number', 'Please enter a positive integer for the number of strings.');
      return;
    }

    if (isNaN(min) || isNaN(max) || min > max || min < 0) {
      Alert.alert('Invalid Length', 'Please enter valid minimum and maximum lengths.');
      return;
    }

    try {
      const randexp = new RandExp(regex);
      randexp.max = max; // Set the maximum repetition

      const uniqueStrings = new Set();
      let attempts = 0;
      const maxAttempts = num * 10; // Arbitrary number to prevent infinite loops

      while (uniqueStrings.size < num && attempts < maxAttempts) {
        let generated = randexp.gen();

        // Replace empty string with epsilon symbol for display
        if (generated === '') {
          generated = 'ε';
        }

        // Check length constraints
        const length = generated === 'ε' ? 0 : generated.length;
        if (length >= min && length <= max) {
          uniqueStrings.add(generated);
        }

        attempts += 1;
      }

      if (uniqueStrings.size < num) {
        Alert.alert(
          'Generation Incomplete',
          `Only generated ${uniqueStrings.size} unique strings after ${maxAttempts} attempts.`
        );
      }

      // Convert Set to array and sort from shortest to longest
      const sortedStrings = Array.from(uniqueStrings).sort((a, b) => {
        const lenA = a === 'ε' ? 0 : a.length;
        const lenB = b === 'ε' ? 0 : b.length;
        if (lenA !== lenB) return lenA - lenB;
        // If lengths are equal, sort lexicographically
        return a.localeCompare(b);
      });

      // Map to objects for FlatList
      const stringsArray = sortedStrings.map((str, index) => ({
        id: index.toString(),
        value: str,
      }));

      setGeneratedStrings(stringsArray);
      setError('');
    } catch (err) {
      console.error('Error generating strings:', err);
      Alert.alert('Generation Error', 'An error occurred while generating strings.');
    }
  };

  return (
    <Animatable.View animation="fadeInUp" duration={1000} style={styles.container}>
      <Text style={styles.heading}>String Generator</Text>

      {/* Regex Input */}
      <RegexInput regex={regex} setRegex={setRegex} />

      {/* Number of Strings */}
      <TextInput
        label="Number of Strings"
        placeholder="e.g. 10"
        value={numberOfStrings}
        onChangeText={setNumberOfStrings}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        accessibilityLabel="Number of Strings Input"
        accessibilityHint="Enter the number of strings to generate"
      />

      {/* Minimum Length */}
      <TextInput
        label="Minimum Length"
        placeholder="e.g. 3"
        value={minLength}
        onChangeText={setMinLength}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        accessibilityLabel="Minimum Length Input"
        accessibilityHint="Enter the minimum length of the strings"
      />

      {/* Maximum Length */}
      <TextInput
        label="Maximum Length"
        placeholder="e.g. 10"
        value={maxLength}
        onChangeText={setMaxLength}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        accessibilityLabel="Maximum Length Input"
        accessibilityHint="Enter the maximum length of the strings"
      />

      {/* Generate Button */}
      <Button
        mode="contained"
        onPress={handleGenerateStrings}
        style={styles.button}
        icon="generate"
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        uppercase={false}
        accessibilityLabel="Generate Strings Button"
        accessibilityHint="Generates strings based on the provided regex and parameters"
      >
        Generate Strings
      </Button>

      {/* Display Generated Strings */}
      {generatedStrings.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Generated Strings:</Text>
          <FlatList
            data={generatedStrings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <List.Item
                title={item.value}
                left={() => <List.Icon icon="numeric" />}
              />
            )}
            style={styles.list}
          />
        </View>
      )}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  list: {
    maxHeight: 300, // Adjust as needed for scrollable list
  },
});

export default StringGeneratorScreen;
