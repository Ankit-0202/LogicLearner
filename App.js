// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeProvider } from './contexts/ThemeContext'; // Ensure ThemeProvider is correctly imported

import HomeScreen from './screens/HomeScreen';
import TruthTableScreen from './screens/TruthTableScreen';
import TruthTableResultScreen from './screens/TruthTableResultScreen'; // New screen
import EquivalenceScreen from './screens/EquivalenceScreen'; // New screen
import EquivalenceRulesScreen from './screens/EquivalenceRulesScreen'; // Existing screen
import InstructionsScreen from './screens/InstructionsScreen'; // Existing screen

const Stack = createStackNavigator();

const AppContent = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee', // Adjust based on MD3DarkTheme if necessary
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Logic Learner' }} 
        />
        <Stack.Screen 
          name="TruthTable" 
          component={TruthTableScreen} 
          options={{ title: 'Truth Table Generation' }} 
        />
        <Stack.Screen 
          name="TruthTableResult" 
          component={TruthTableResultScreen} 
          options={{ title: 'Truth Table' }} 
        />
        <Stack.Screen 
          name="Equivalence" 
          component={EquivalenceScreen} 
          options={{ title: 'Check Equivalence' }} 
        />
        <Stack.Screen 
          name="EquivalenceRules" 
          component={EquivalenceRulesScreen} 
          options={{ title: 'Equivalence Rules' }} 
        />
        <Stack.Screen 
          name="Instructions" 
          component={InstructionsScreen} 
          options={{ title: 'How It Works' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
