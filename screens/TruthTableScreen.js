import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { createTruthTable } from '../utils/truthTableGenerator';

const TruthTableScreen = ({ route }) => {
  const { formula } = route.params;
  const [truthTable, setTruthTable] = useState([]);

  useEffect(() => {
    try {
      const table = createTruthTable(formula);
      setTruthTable(table);
    } catch (error) {
      setTruthTable([{ error: error.message }]);
    }
  }, [formula]);

  if (truthTable.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Generating truth table...</Text>
      </View>
    );
  }

  if (truthTable[0].error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{truthTable[0].error}</Text>
      </View>
    );
  }

  const headers = Object.keys(truthTable[0]);

  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        <View style={styles.row}>
          {headers.map((header) => (
            <Text key={header} style={styles.header}>
              {header}
            </Text>
          ))}
        </View>
        {truthTable.map((row, index) => (
          <View key={index} style={styles.row}>
            {headers.map((header) => (
              <Text key={header} style={styles.cell}>
                {row[header].toString()}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  header: {
    fontWeight: 'bold',
    marginRight: 15,
  },
  cell: {
    marginRight: 15,
  },
  error: {
    color: 'red',
    fontSize: 18,
  },
});

export default TruthTableScreen;
