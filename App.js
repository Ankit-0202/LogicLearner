// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeProvider } from './contexts/ThemeContext';

import HomeScreen from './screens/HomeScreen';
import TruthTableScreen from './screens/TruthTableScreen';
import TruthTableResultScreen from './screens/TruthTableResultScreen';
import InstructionsScreen from './screens/InstructionsScreen';
import EquivalenceRulesScreen from './screens/EquivalenceRulesScreen';
import EquivalenceScreen from './screens/EquivalenceScreen';
import ApplyLawsScreen from './screens/ApplyLawsScreen'; // Import the new screen

const Stack = createStackNavigator();

const AppContent = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee', // Adjust based on your theme if necessary
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
          options={{ title: 'Generate Truth Table' }} 
        />
        <Stack.Screen 
          name="TruthTableResult" 
          component={TruthTableResultScreen} 
          options={{ title: 'Truth Table Result' }} 
        />
        <Stack.Screen 
          name="Instructions" 
          component={InstructionsScreen} 
          options={{ title: 'How It Works' }} 
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
          name="ApplyLaws" 
          component={ApplyLawsScreen} 
          options={{ title: 'Apply Logical Laws' }} 
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
