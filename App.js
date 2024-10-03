// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeProvider } from './contexts/ThemeContext'; // Ensure ThemeProvider is correctly imported
import { useContext } from 'react';

import HomeScreen from './screens/HomeScreen';
import TruthTableScreen from './screens/TruthTableScreen';
import InstructionsScreen from './screens/InstructionsScreen';
import EquivalenceRulesScreen from './screens/EquivalenceRulesScreen'; // Import the new screen

const Stack = createStackNavigator();

const AppContent = () => {
  // If you have global theme settings or need to access theme context here, you can do so
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee', // This can be dynamic based on theme if needed
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
          options={{ title: 'Truth Table' }} 
        />
        <Stack.Screen 
          name="Instructions" 
          component={InstructionsScreen} 
          options={{ title: 'How It Works' }} 
        />
        <Stack.Screen 
          name="EquivalenceRules" 
          component={EquivalenceRulesScreen} 
          options={{ title: 'Equivalence Rules' }} // Set a meaningful title
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
