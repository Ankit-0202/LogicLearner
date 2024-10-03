// App.js

import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import TruthTableScreen from './screens/TruthTableScreen';
import InstructionsScreen from './screens/InstructionsScreen';

const Stack = createStackNavigator();

// Custom Theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',      // Primary color
    accent: '#03dac4',       // Accent color
    background: '#f2f2f2',   // Background color
    surface: '#ffffff',      // Surface color
    text: '#000000',         // Text color
    error: '#B00020',        // Error color
    // Add more custom colors if needed
  },
  roundness: 8, // Adjust the roundness of components
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
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
    </PaperProvider>
  );
};

export default App;
