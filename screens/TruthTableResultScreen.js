// screens/TruthTableResultScreen.js

import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Text, DataTable, useTheme, Button } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

const TruthTableResultScreen = ({ route, navigation }) => {
  const { headers, table, formula } = route.params;
  const { colors } = useTheme();

  if (!headers || !table || !formula) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: colors.error }]}>Incomplete data provided.</Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          icon="arrow-left"
          contentStyle={styles.backButtonContent}
          labelStyle={styles.backButtonLabel}
          animated
          uppercase={false}
        >
          Back to Generator
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Outer ScrollView for vertical scrolling */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        stickyHeaderIndices={[0]} // Make the header sticky
      >
        {/* Header */}
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
          <DataTable>
            <DataTable.Header style={{ backgroundColor: colors.primary }}>
              {headers.map((header, index) => (
                <DataTable.Title key={index} style={styles.headerCell}>
                  <Text style={[styles.headerText, { color: colors.surface, textAlign: 'center' }]}>
                    {header}
                  </Text>
                </DataTable.Title>
              ))}
            </DataTable.Header>
          </DataTable>
        </Animatable.View>

        {/* Table Rows */}
        <Animatable.View animation="fadeIn" duration={1000} style={styles.tableContainer}>
          <DataTable>
            {table.map((row, rowIndex) => (
              <Animatable.View 
                key={rowIndex} 
                animation="fadeInUp" 
                delay={rowIndex * 100} 
                duration={500}
              >
                <DataTable.Row>
                  {headers.map((header, colIndex) => (
                    <DataTable.Cell key={colIndex} style={styles.cell}>
                      <Text style={styles.cellText}>{row[header]}</Text>
                    </DataTable.Cell>
                  ))}
                </DataTable.Row>
              </Animatable.View>
            ))}
          </DataTable>
        </Animatable.View>
      </ScrollView>

      {/* Footer with Back Button */}
      <Animatable.View animation="fadeInUp" duration={1000} delay={200} style={styles.footer}>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          icon="arrow-left"
          contentStyle={styles.backButtonContent}
          labelStyle={styles.backButtonLabel}
          animated
          uppercase={false}
        >
          Back to Generator
        </Button>
      </Animatable.View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Adjust based on theme if necessary
  },
  scrollContainer: {
    padding: 20,
    // No need to center content since it's scrollable
  },
  header: {
    // No marginBottom to keep header sticky
  },
  tableContainer: {
    width: '100%',
    // Optional: Add marginTop if needed
  },
  headerCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center the header text
    paddingVertical: 8,
    minWidth: 80, // Set a minimum width for each column to improve readability
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center the cell text
    paddingVertical: 8,
    minWidth: 80, // Set a minimum width for each column to improve readability
  },
  cellText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333', // Adjust based on theme
  },
  footer: {
    padding: 20,
    alignItems: 'center',
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
  errorContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default TruthTableResultScreen;
