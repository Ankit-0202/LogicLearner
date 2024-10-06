// screens/HomeScreen.js

import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Button, Title, FAB, useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View animation="fadeIn" duration={1000} style={styles.content}>
        <Title style={styles.title}>Logic Learner</Title>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('TruthTable')}
            style={styles.button}
            icon="table"
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            animated
            uppercase={false}
          >
            Generate Truth Table
          </Button>
          
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Equivalence')}
            style={styles.button}
            icon="check-circle"
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            animated
            uppercase={false}
          >
            Check Equivalence
          </Button>
          
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ApplyLaws')}
            style={styles.button}
            icon="format-list-bulleted"
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            animated
            uppercase={false}
          >
            Equivalence Assistant
          </Button>
        </View>
      </Animatable.View>

      {/* Floating Action Button (FAB) for XKCD */}
      <FAB
        style={styles.fab}
        small={false}
        icon="cards" // Choose an appropriate icon from MaterialCommunityIcons
        label="XKCD Comics"
        onPress={() => navigation.navigate('XKCD')}
        accessibilityLabel="Navigate to XKCD Comics"
        accessibilityHint="Opens the XKCD comics screen to view comics"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Adjust based on theme if necessary
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
    color: '#333', // Adjust based on theme
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee', // Adjust based on your theme
  },
});

export default HomeScreen;
