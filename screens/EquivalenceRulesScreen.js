// screens/EquivalenceRulesScreen.js

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Title, List, useTheme, Divider, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

const EquivalenceRulesScreen = () => {
  const { colors } = useTheme();

  // Define the equivalence rules organized by category
  const equivalenceRules = {
    "Commutative Properties": [
      {
        name: "Commutative Law (AND)",
        symbolic: "A ∧ B ≡ B ∧ A",
      },
      {
        name: "Commutative Law (OR)",
        symbolic: "A ∨ B ≡ B ∨ A",
      },
    ],
    "Associative Properties": [
      {
        name: "Associative Law (AND)",
        symbolic: "(A ∧ B) ∧ C ≡ A ∧ (B ∧ C)",
      },
      {
        name: "Associative Law (OR)",
        symbolic: "(A ∨ B) ∨ C ≡ A ∨ (B ∨ C)",
      },
    ],
    "Distributive Laws": [
      {
        name: "Distributive Law (AND over OR)",
        symbolic: "A ∧ (B ∨ C) ≡ (A ∧ B) ∨ (A ∧ C)",
      },
      {
        name: "Distributive Law (OR over AND)",
        symbolic: "A ∨ (B ∧ C) ≡ (A ∨ B) ∧ (A ∨ C)",
      },
    ],
    "Idempotent Laws": [
      {
        name: "Idempotent Law (AND)",
        symbolic: "A ∧ A ≡ A",
      },
      {
        name: "Idempotent Law (OR)",
        symbolic: "A ∨ A ≡ A",
      },
    ],
    "De Morgan’s Laws": [
      {
        name: "De Morgan's Law (AND)",
        symbolic: "¬(A ∧ B) ≡ ¬A ∨ ¬B",
      },
      {
        name: "De Morgan's Law (OR)",
        symbolic: "¬(A ∨ B) ≡ ¬A ∧ ¬B",
      },
    ],
    "Laws of the Excluded Middle (Inverse Laws)": [
      {
        name: "Law of Excluded Middle",
        symbolic: "A ∨ ¬A ≡ ⊤",
      },
      {
        name: "Law of Non-Contradiction",
        symbolic: "A ∧ ¬A ≡ ⊥",
      },
    ],
    "Identity Laws": [
      {
        name: "Identity Law (AND)",
        symbolic: "A ∧ ⊤ ≡ A",
      },
      {
        name: "Identity Law (OR)",
        symbolic: "A ∨ ⊥ ≡ A",
      },
    ],
    "Domination Laws": [
      {
        name: "Domination Law (AND)",
        symbolic: "A ∧ ⊥ ≡ ⊥",
      },
      {
        name: "Domination Law (OR)",
        symbolic: "A ∨ ⊤ ≡ ⊤",
      },
    ],
    "Equivalence of an Implication and its Contrapositive": [
      {
        name: "Implication and Contrapositive",
        symbolic: "A → B ≡ ¬B → ¬A",
      },
    ],
    "Writing an Implication as a Disjunction": [
      {
        name: "Implication as Disjunction",
        symbolic: "A → B ≡ ¬A ∨ B",
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
        <Title style={styles.title}>Equivalence Rules</Title>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={1200} delay={200} style={styles.content}>
        {Object.keys(equivalenceRules).map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <Divider style={styles.divider} />
            {equivalenceRules[category].map((rule, idx) => (
              <View key={idx}>
                <View style={styles.ruleContainer}>
                  <Text style={styles.ruleName}>{rule.name}</Text>
                  <Text style={styles.ruleSymbolic}>{rule.symbolic}</Text>
                </View>
                {idx < equivalenceRules[category].length - 1 && <Divider style={styles.innerDivider} />}
              </View>
            ))}
          </View>
        ))}
      </Animatable.View>
    </ScrollView>
  );
};

// Styles for the screen
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff', // Consider using theme colors if needed
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
    color: '#333', // Adjust based on theme
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    // Additional styling if needed
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginBottom: 5,
  },
  divider: {
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  ruleContainer: {
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  ruleName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  ruleSymbolic: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  innerDivider: {
    backgroundColor: '#eee',
    marginVertical: 5,
  },
});

export default EquivalenceRulesScreen;
