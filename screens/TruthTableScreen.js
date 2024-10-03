import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ActivityIndicator, Card } from 'react-native-paper';
import { createTruthTable } from '../utils/truthTableGenerator';
import { Table, Row, Rows } from 'react-native-table-component';

const TruthTableScreen = ({ route }) => {
  const { formula } = route.params;
  const [truthTable, setTruthTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    try {
      const table = createTruthTable(formula);
      if (table.length === 0) {
        throw new Error('Empty truth table.');
      }

      // Extract headers
      const headers = Object.keys(table[0]);
      setTableHead(headers);

      // Extract rows
      const rows = table.map(row => headers.map(header => row[header] === true ? 'True' : row[header] === false ? 'False' : row[header].toString()));
      setTableData(rows);

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
        <ActivityIndicator animating={true} size="large" />
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

  return (
    <ScrollView horizontal style={styles.container}>
      <View style={styles.tableContainer}>
        <Card style={styles.card}>
          <Card.Title title={`Truth Table for: ${formula}`} />
          <Card.Content>
            <Table borderStyle={styles.tableBorder}>
              <Row data={tableHead} style={styles.head} textStyle={styles.textHead} />
              <Rows data={tableData} textStyle={styles.text} />
            </Table>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  tableContainer: {
    flex: 1,
    padding: 10,
  },
  card: {
    padding: 10,
    elevation: 4,
  },
  head: {
    height: 40,
    backgroundColor: '#6200ee',
  },
  textHead: {
    margin: 6,
    color: '#fff',
    fontWeight: 'bold',
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default TruthTableScreen;
