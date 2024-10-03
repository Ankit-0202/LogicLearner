import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [formula, setFormula] = useState('');

  const handleGenerate = () => {
    if (!formula.trim()) {
      Alert.alert('Input Error', 'Please enter a propositional logic formula.');
      return;
    }
    // Navigate to TruthTableScreen with the formula
    navigation.navigate('Truth Table', { formula });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Propositional Logic Learner</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter formula (e.g., A AND (B OR C))"
        value={formula}
        onChangeText={setFormula}
      />
      <Button title="Generate Truth Table" onPress={handleGenerate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#999',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
