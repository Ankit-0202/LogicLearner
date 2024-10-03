import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import TruthTableScreen from './screens/TruthTableScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Logic Learner" component={HomeScreen} />
        <Stack.Screen name="Truth Table" component={TruthTableScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
