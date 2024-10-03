// screens/TruthTableScreen.js

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, DataTable, ActivityIndicator, useTheme } from 'react-native-paper';
import { createTruthTable } from '../utils/truthTableGenerator';

const TruthTableScreen = ({ route }) => {
  const { formula } = route.params;
  const [truthTable, setTruthTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { colors } = useTheme(); // Access theme colors

  useEffect(() => {
    try {
      const table = createTruthTable(formula);
      setTruthTable(table);
    } catch (err) {
      setError(err.message);
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

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
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
    <ScrollView horizontal style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
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
    color: 'red',
    fontSize: 18,
  },
  headerCell: {
    minWidth: 50,
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
  },
  cell: {
    minWidth: 50,
    justifyContent: 'center',
  },
});

export default TruthTableScreen;
