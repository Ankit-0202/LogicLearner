// src/components/RegexInput.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { validateRegex } from '../utils/regexUtils';

const RegexInput = ({ regex, setRegex }) => {
  const { valid, message } = validateRegex(regex);

  return (
    <View style={styles.container}>
      <TextInput
        label="Enter Regex"
        placeholder="e.g. (a|b)*c"
        value={regex}
        onChangeText={setRegex}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        error={!valid}
        accessibilityLabel="Regex Input Field"
        accessibilityHint="Enter a regular expression with allowed syntax"
      />
      {!valid && (
        <HelperText type="error" visible={!valid}>
          {message}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
  },
});

export default RegexInput;
