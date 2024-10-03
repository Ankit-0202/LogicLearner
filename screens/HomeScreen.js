import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Modal, Portal, Provider, IconButton, Card, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [formula, setFormula] = useState('');
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleGenerate = () => {
    if (!formula.trim()) {
      alert('Please enter a propositional logic formula.');
      return;
    }
    navigation.navigate('TruthTable', { formula });
  };

  return (
    <Provider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* Welcome Card */}
          <Card style={styles.card}>
            <Card.Title title="Welcome to Logic Learner" />
            <Card.Content>
              <Paragraph>
                Logic Learner helps you understand propositional logic by generating truth tables for your formulas.
              </Paragraph>
            </Card.Content>
          </Card>

          {/* Input Card */}
          <Card style={styles.card}>
            <Card.Title
              title="Enter Your Formula"
              right={(props) => (
                <IconButton {...props} icon="help-circle" onPress={showModal} />
              )}
            />
            <Card.Content>
              <TextInput
                label="Propositional Logic Formula"
                placeholder="e.g., A AND (B OR NOT C)"
                value={formula}
                onChangeText={setFormula}
                mode="outlined"
                style={styles.input}
              />
              <Button mode="contained" onPress={handleGenerate} style={styles.button}>
                Generate Truth Table
              </Button>
            </Card.Content>
          </Card>

          {/* Instructions Modal */}
          <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
              <Text style={styles.modalTitle}>Input Syntax Rules</Text>
              <Text style={styles.modalText}>
                - **Variables:** Use single letters (A, B, C, etc.).
              </Text>
              <Text style={styles.modalText}>
                - **Operators:**
                {'\n'}  - **AND:** `AND`, `∧`
                {'\n'}  - **OR:** `OR`, `∨`
                {'\n'}  - **NOT:** `NOT`, `¬`
                {'\n'}  - **IMPLIES:** `IMPLIES`, `→`
                {'\n'}  - **IFF:** `IFF`, `↔`
              </Text>
              <Text style={styles.modalText}>
                - **Parentheses:** Use parentheses to define the order of operations.
                {'\n'}- **Example:** `A AND (B OR NOT C)` or `A ∧ (B ∨ ¬C)`
              </Text>
              <Button onPress={hideModal} mode="contained" style={styles.button}>
                Close
              </Button>
            </Modal>
          </Portal>
        </ScrollView>
      </KeyboardAvoidingView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 10,
    fontSize: 16,
  },
});

export default HomeScreen;
