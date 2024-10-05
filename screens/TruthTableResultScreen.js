// screens/TruthTableResultScreen.js

import React, { useRef } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Dimensions, View } from 'react-native';
import { Text, DataTable, useTheme, Button } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

const TruthTableResultScreen = ({ route, navigation }) => {
  const { headers, table, formula } = route.params;
  const { colors } = useTheme();

  // Refs for synchronized scrolling
  const headerScrollRef = useRef(null);
  const bodyScrollRef = useRef(null);

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

  // Function to handle horizontal scroll synchronization
  const handleHeaderScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    if (bodyScrollRef.current) {
      bodyScrollRef.current.scrollTo({ x, animated: false });
    }
  };

  const handleBodyScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollTo({ x, animated: false });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Outer ScrollView for vertical scrolling */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header ScrollView */}
        <ScrollView
          horizontal={true}
          ref={headerScrollRef}
          onScroll={handleHeaderScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={styles.headerScroll}
        >
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
        </ScrollView>

        {/* Body ScrollView */}
        <ScrollView
          horizontal={true}
          ref={bodyScrollRef}
          onScroll={handleBodyScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={styles.bodyScroll}
        >
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
  },
  headerScroll: {
    // Optional: Adjust height if needed
  },
  bodyScroll: {
    // Optional: Adjust height if needed
    marginTop: 0,
  },
  header: {
    // No marginBottom to keep header sticky
  },
  tableContainer: {
    // Adjust minWidth based on content
  },
  headerCell: {
    justifyContent: 'center',
    alignItems: 'center', // Center the header text
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 100, // Set a minimum width for each column to improve readability
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center', // Center the cell text
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 100, // Set a minimum width for each column to match header
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default TruthTableResultScreen;
