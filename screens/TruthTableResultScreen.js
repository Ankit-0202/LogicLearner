// screens/TruthTableResultScreen.js

import React, { useRef } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View } from 'react-native';
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
        <View style={styles.fixedHeader}>
          <ScrollView
            horizontal={true}
            ref={headerScrollRef}
            onScroll={handleHeaderScroll}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
          >
            <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
              <DataTable>
                <DataTable.Header style={[styles.dataHeader, { backgroundColor: colors.primary }]}>
                  {headers.map((header, index) => (
                    <DataTable.Title key={index} style={styles.headerCell}>
                      <Text style={[styles.headerText, { color: colors.surface }]}>
                        {header}
                      </Text>
                    </DataTable.Title>
                  ))}
                </DataTable.Header>
              </DataTable>
            </Animatable.View>
          </ScrollView>
        </View>

        {/* Body ScrollView */}
        <ScrollView
          horizontal={true}
          ref={bodyScrollRef}
          onScroll={handleBodyScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={true}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Adjust based on theme
  },
  scrollContainer: {
    paddingBottom: 100, // Ensure there's enough space at the bottom
  },
  fixedHeader: {
    zIndex: 10, // Ensure the header stays on top
    backgroundColor: '#fff', // To avoid overlap issues with scroll
    elevation: 2, // Adds shadow for iOS/Android
  },
  header: {
    paddingVertical: 5, // Add some padding for better readability
  },
  dataHeader: {
    justifyContent: 'center',
    paddingVertical: 8,
  },
  headerCell: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    minWidth: 120, // Adjust based on expected content size
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  tableContainer: {
    marginTop: 0,
    paddingVertical: 10,
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    minWidth: 120, // Ensure columns are wide enough for content
  },
  cellText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
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
