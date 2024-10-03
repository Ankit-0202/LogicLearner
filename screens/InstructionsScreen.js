// screens/InstructionsScreen.js

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Title, Paragraph, List, Divider } from 'react-native-paper';

const InstructionsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>How It Works</Title>

      <Paragraph style={styles.paragraph}>
        Welcome to the Propositional Logic Learner! This app helps you understand and visualize propositional logic formulas by generating their corresponding truth tables.
      </Paragraph>

      <Divider style={styles.divider} />

      <Title style={styles.subtitle}>Input Syntax Rules</Title>

      <List.Section>
        <List.Item
          title="Variables"
          description="Use single uppercase letters (A, B, C, etc.) to represent propositional variables."
          left={props => <List.Icon {...props} icon="alpha" />}
        />
        <List.Item
          title="Operators"
          description={`Use the following operators for logical operations:
- AND: AND or &
- OR: OR or |
- NOT: NOT or ~
- IMPLIES: IMPLIES or ->
- IFF (If and Only If): IFF or <->`}
          left={props => <List.Icon {...props} icon="function-variant" />}
        />
        <List.Item
          title="Parentheses"
          description="Use parentheses to define the order of operations. For example: A AND (B OR C)"
          left={props => <List.Icon {...props} icon="parentheses" />}
        />
      </List.Section>

      <Divider style={styles.divider} />

      <Title style={styles.subtitle}>Examples</Title>

      <List.Section>
        <List.Item
          title="Example 1"
          description="Formula: A AND B"
          left={props => <List.Icon {...props} icon="math-logical-and" />}
        />
        <List.Item
          title="Example 2"
          description="Formula: A OR (B AND NOT C)"
          left={props => <List.Icon {...props} icon="math-logical-or" />}
        />
        <List.Item
          title="Example 3"
          description="Formula: (A IMPLIES B) IFF (C OR D)"
          left={props => <List.Icon {...props} icon="math-logical-iff" />}
        />
        <List.Item
          title="Symbolic Example"
          description="Formula: A & (B | ~C) -> D <-> E"
          left={props => <List.Icon {...props} icon="math-logical-implications" />}
        />
      </List.Section>

      <Divider style={styles.divider} />

      <Paragraph style={styles.paragraph}>
        Enter your formula in the input field on the Home Screen and tap "Generate Truth Table" to visualize the logical relationships.
      </Paragraph>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  paragraph: {
    marginBottom: 10,
    color: '#555',
    lineHeight: 20,
  },
  divider: {
    marginVertical: 20,
  },
});

export default InstructionsScreen;
