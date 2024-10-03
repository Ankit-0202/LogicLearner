// screens/TruthTableResultScreen.js

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, DataTable, ActivityIndicator, useTheme, Snackbar, Button } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { createTruthTable } from '../utils/truthTableGenerator';

const TruthTableResultScreen = ({ route, navigation }) => {
  const { formula } = route.params || {}; // Handle cases where route.params might be undefined
  const [truthTable, setTruthTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { colors } = useTheme();

  useEffect(() => {
    if (!formula) {
      setSnackbarMessage('No formula provided.');
      setVisible(true);
      setLoading(false);
      return;
    }

    try {
      const table = createTruthTable(formula);
      setTruthTable(table);
    } catch (err) {
      setSnackbarMessage(err.message);
      setVisible(true);
    } finally {
      setLoading(false);
    }
  }, [formula]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating={true} color={colors.primary} size="large" />
        <Text style={styles.loaderText}>Generating truth table...</Text>
      </View>
    );
  }

  if (truthTable.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No data available.</Text>
      </View>
    );
  }

  const headers = Object.keys(truthTable[0]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <Animatable.View animation="fadeIn" duration={1000} style={styles.tableContainer}>
          <DataTable>
            <DataTable.Header style={{ backgroundColor: colors.primary }}>
              {headers.map((header) => (
                <DataTable.Title key={header} style={styles.headerCell}>
                  <Text style={[styles.headerText, { color: colors.surface }]}>
                    {header}
                  </Text>
                </DataTable.Title>
              ))}
            </DataTable.Header>

            {truthTable.map((row, index) => (
              <Animatable.View 
                key={index} 
                animation="fadeInUp" 
                delay={index * 100} 
                duration={500}
              >
                <DataTable.Row>
                  {headers.map((header) => (
                    <DataTable.Cell key={header} style={styles.cell}>
                      <Text>{row[header].toString()}</Text>
                    </DataTable.Cell>
                  ))}
                </DataTable.Row>
              </Animatable.View>
            ))}
          </DataTable>
        </Animatable.View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('TruthTable')}
          style={styles.backButton}
          icon="arrow-left"
          contentStyle={styles.backButtonContent}
          labelStyle={styles.backButtonLabel}
          animated
          uppercase={false}
        >
          Back to Generate
        </Button>
      </View>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => {
            setVisible(false);
          },
        }}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:20,
  },
  errorText: {
    color: '#B00020',
    fontSize: 18,
  },
  tableContainer: {
    paddingVertical: 10,
  },
  headerCell: {
    minWidth: 80,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cell: {
    minWidth: 80,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  backButton: {
    borderRadius: 8,
    width: '80%',
  },
  backButtonContent: {
    height: 50,
  },
  backButtonLabel: {
    fontSize: 16,
  },
  snackbar: {
    backgroundColor: '#B00020',
  },
});

export default TruthTableResultScreen;
