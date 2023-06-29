import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './screens/signUpScreen';
import SignInScreen from './screens/signInScreen';
import HomeScreen from './screens/homeScreen';
import HistoryScreen from './screens/historyScreen';
import TaskDetailsScreen from './screens/taskDetailsScreen';
import AddTaskScreen from './screens/addTaskScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Add" component={AddTaskScreen} />
        <Stack.Screen name="Details" component={TaskDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default App;