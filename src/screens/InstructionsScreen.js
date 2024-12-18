// screens/InstructionsScreen.js

import React from 'react';
import { ScrollView, StyleSheet, View, SafeAreaView } from 'react-native';
import { Title, Paragraph, List, Divider, Button, useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

const InstructionsScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
          <Title style={styles.title}>How It Works</Title>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1200} delay={200} style={styles.content}>
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

          {/* Add a button to navigate to Equivalence Rules */}
          <View style={styles.equivalenceButtonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('EquivalenceRules')}
              style={styles.equivalenceButton}
              icon="table-search"
              contentStyle={styles.equivalenceButtonContent}
              labelStyle={styles.equivalenceButtonLabel}
              animated
              uppercase={false}
            >
              View Equivalence Rules
            </Button>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Adjust based on theme if necessary
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  subtitle: {
    marginTop: 20,
    marginBottom: 10,
    color: '#333', // Adjust based on theme
  },
  paragraph: {
    marginBottom: 10,
    color: '#555', // Adjust based on theme
    lineHeight: 20,
    textAlign: 'center', // Center text for better readability
  },
  divider: {
    marginVertical: 20,
    width: '100%',
  },
  equivalenceButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  equivalenceButton: {
    borderRadius: 8,
    width: '80%',
  },
  equivalenceButtonContent: {
    height: 50,
  },
  equivalenceButtonLabel: {
    fontSize: 16,
  },
});

export default InstructionsScreen;
