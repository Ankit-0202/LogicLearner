// screens/TruthTableScreen.js

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, DataTable, ActivityIndicator, useTheme, Snackbar } from 'react-native-paper';
import { createTruthTable } from '../utils/truthTableGenerator';

const TruthTableScreen = ({ route }) => {
  const { formula } = route.params;
  const [truthTable, setTruthTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { colors } = useTheme();

  useEffect(() => {
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
        <Text>Generating truth table...</Text>
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
        <View>
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
              <DataTable.Row key={index}>
                {headers.map((header) => (
                  <DataTable.Cell key={header} style={styles.cell}>
                    <Text>{row[header].toString()}</Text>
                  </DataTable.Cell>
                ))}
              </DataTable.Row>
            ))}
          </DataTable>
        </View>
      </ScrollView>

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
  snackbar: {
    backgroundColor: '#B00020',
  },
});

export default TruthTableScreen;
