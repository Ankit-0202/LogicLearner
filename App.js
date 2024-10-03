// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeProvider, ThemeContext } from './contexts/ThemeContext';
import { useContext } from 'react';

import HomeScreen from './screens/HomeScreen';
import TruthTableScreen from './screens/TruthTableScreen';
import InstructionsScreen from './screens/InstructionsScreen';

const Stack = createStackNavigator();

const AppContent = () => {
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkTheme ? '#bb86fc' : '#6200ee',
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
