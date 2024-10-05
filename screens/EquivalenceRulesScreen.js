// screens/EquivalenceRulesScreen.js

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Title, DataTable, useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

const EquivalenceRulesScreen = () => {
  const { colors } = useTheme();

  // Define the equivalence rules without the 'example' field
  const equivalenceRules = [
    {
      name: "De Morgan's Law (AND)",
      symbolic: "¬(A ∧ B) ≡ (¬A) ∨ (¬B)",
    },
    {
      name: "De Morgan's Law (OR)",
      symbolic: "¬(A ∨ B) ≡ (¬A) ∧ (¬B)",
    },
    {
      name: "Double Negation",
      symbolic: "¬(¬A) ≡ A",
    },
    {
      name: "Commutative Law (AND)",
      symbolic: "A ∧ B ≡ B ∧ A",
    },
    {
      name: "Commutative Law (OR)",
      symbolic: "A ∨ B ≡ B ∨ A",
    },
    {
      name: "Associative Law (AND)",
      symbolic: "(A ∧ B) ∧ C ≡ A ∧ (B ∧ C)",
    },
    {
      name: "Associative Law (OR)",
      symbolic: "(A ∨ B) ∨ C ≡ A ∨ (B ∨ C)",
    },
    {
      name: "Distributive Law (AND over OR)",
      symbolic: "A ∧ (B ∨ C) ≡ (A ∧ B) ∨ (A ∧ C)",
    },
    {
      name: "Distributive Law (OR over AND)",
      symbolic: "A ∨ (B ∧ C) ≡ (A ∨ B) ∧ (A ∨ C)",
    },
    {
      name: "Implication",
      symbolic: "A → B ≡ ¬A ∨ B",
    },
    {
      name: "Biconditional",
      symbolic: "A ↔ B ≡ (A → B) ∧ (B → A)",
    },
    {
      name: "Absorption Law (AND)",
      symbolic: "A ∧ (A ∨ B) ≡ A",
    },
    {
      name: "Absorption Law (OR)",
      symbolic: "A ∨ (A ∧ B) ≡ A",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
        <Title style={styles.title}>Equivalence Rules</Title>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={1200} delay={200} style={styles.content}>
        <DataTable>
          <DataTable.Header style={{ backgroundColor: colors.primary }}>
            <DataTable.Title style={styles.headerCell}>Rule</DataTable.Title>
            <DataTable.Title style={styles.headerCell}>Symbolic</DataTable.Title>
          </DataTable.Header>

          {equivalenceRules.map((rule, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell style={styles.cell}>{rule.name}</DataTable.Cell>
              <DataTable.Cell style={styles.cell}>{rule.symbolic}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Animatable.View>
    </ScrollView>
  );
};

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
  },
  content: {
    // Additional styling if needed
  },
  headerCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center the header text
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center the cell text
    paddingVertical: 8,
  },
});

export default EquivalenceRulesScreen;
