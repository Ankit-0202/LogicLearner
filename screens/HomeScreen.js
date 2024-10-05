// screens/HomeScreen.js

import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Button, Title, useTheme } from 'react-native-paper';
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
        </View>
      </Animatable.View>
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
});

export default HomeScreen;
