// screens/EquivalenceRulesScreen.js

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Title, DataTable, useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

const EquivalenceRulesScreen = () => {
  const { colors } = useTheme();

  // Define the equivalence rules
  const equivalenceRules = [
    {
      name: "De Morgan's Law",
      symbolic: "¬(A ∧ B) ≡ (¬A) ∨ (¬B)",
      example: "¬(P ∧ Q) ≡ ¬P ∨ ¬Q",
    },
    {
      name: "De Morgan's Law",
      symbolic: "¬(A ∨ B) ≡ (¬A) ∧ (¬B)",
      example: "¬(P ∨ Q) ≡ ¬P ∧ ¬Q",
    },
    {
      name: "Double Negation",
      symbolic: "¬(¬A) ≡ A",
      example: "¬(¬P) ≡ P",
    },
    {
      name: "Commutative Law (AND)",
      symbolic: "A ∧ B ≡ B ∧ A",
      example: "P ∧ Q ≡ Q ∧ P",
    },
    {
      name: "Commutative Law (OR)",
      symbolic: "A ∨ B ≡ B ∨ A",
      example: "P ∨ Q ≡ Q ∨ P",
    },
    {
      name: "Associative Law (AND)",
      symbolic: "(A ∧ B) ∧ C ≡ A ∧ (B ∧ C)",
      example: "(P ∧ Q) ∧ R ≡ P ∧ (Q ∧ R)",
    },
    {
      name: "Associative Law (OR)",
      symbolic: "(A ∨ B) ∨ C ≡ A ∨ (B ∨ C)",
      example: "(P ∨ Q) ∨ R ≡ P ∨ (Q ∨ R)",
    },
    {
      name: "Distributive Law (AND over OR)",
      symbolic: "A ∧ (B ∨ C) ≡ (A ∧ B) ∨ (A ∧ C)",
      example: "P ∧ (Q ∨ R) ≡ (P ∧ Q) ∨ (P ∧ R)",
    },
    {
      name: "Distributive Law (OR over AND)",
      symbolic: "A ∨ (B ∧ C) ≡ (A ∨ B) ∧ (A ∨ C)",
      example: "P ∨ (Q ∧ R) ≡ (P ∨ Q) ∧ (P ∨ R)",
    },
    {
      name: "Implication",
      symbolic: "A → B ≡ ¬A ∨ B",
      example: "P → Q ≡ ¬P ∨ Q",
    },
    {
      name: "Biconditional",
      symbolic: "A ↔ B ≡ (A → B) ∧ (B → A)",
      example: "P ↔ Q ≡ (P → Q) ∧ (Q → P)",
    },
    {
      name: "Absorption Law (AND)",
      symbolic: "A ∧ (A ∨ B) ≡ A",
      example: "P ∧ (P ∨ Q) ≡ P",
    },
    {
      name: "Absorption Law (OR)",
      symbolic: "A ∨ (A ∧ B) ≡ A",
      example: "P ∨ (P ∧ Q) ≡ P",
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
            <DataTable.Title style={styles.headerCell}>Example</DataTable.Title>
          </DataTable.Header>

          {equivalenceRules.map((rule, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell style={styles.cell}>{rule.name}</DataTable.Cell>
              <DataTable.Cell style={styles.cell}>{rule.symbolic}</DataTable.Cell>
              <DataTable.Cell style={styles.cell}>{rule.example}</DataTable.Cell>
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
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  content: {
    // Additional styling if needed
  },
  headerCell: {
    flex: 1,
    justifyContent: 'center',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default EquivalenceRulesScreen;
