// src/components/FormulaInput.js

import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

/**
 * Reusable FormulaInput Component
 * 
 * Props:
 * - label: Label for the TextInput
 * - placeholder: Placeholder text
 * - value: Current value of the input
 * - onChange: Function to handle text change
 * - error: Boolean indicating if there's an error
 * - errorMessage: Error message to display
 * - ...otherProps: Additional props for TextInput
 */
const FormulaInput = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  errorMessage,
  ...otherProps
}) => {
  return (
    <>
      <TextInput
        label={label}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        mode="outlined"
        style={styles.input}
        autoCapitalize="characters"
        left={<TextInput.Icon name="math-compass" />}
        error={error}
        {...otherProps}
      />
      {error && (
        <HelperText type="error" visible={error}>
          {errorMessage}
        </HelperText>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    marginBottom: 8,
  },
});

export default FormulaInput;
