import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { baseURL } from '../config.js';

interface Task {
  id: string;
  title: string;
  description: string;
  finished: boolean;
  priority: number;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}


const HomeScreen: React.FC<any> = ({navigation}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchUnfinishedTasks = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const response = await axios.get(`${baseURL}/task/unfinished`, {
        headers: { Authorization: `${accessToken}` },
      });
      setTasks(response.data);
    } catch (error) {
      alert('Error retrieving tasks:');
    }
  };

  useFocusEffect(React.useCallback(() => {
    fetchUnfinishedTasks();
  },[]));

  const handleAddTask = () => {
    navigation.navigate('Add');
  };

  const handleSignOut = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    navigation.navigate('SignIn');
  };

  const handleFinishedTasks = () => {
    navigation.navigate('History'  ) ;
  };

  const  handleMarkTaskFinished = async (taskId: string) => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      await axios.patch(
        `${baseURL}/task/${taskId}/`,
        {finished: true},
        {
          headers: { Authorization: `${accessToken}` },
        }
      );
      fetchUnfinishedTasks();
    } catch (error) {
      alert('Error marking task as finished');
    }
  };  

  const handleViewTaskDetails = (task: Task) => {
    navigation.navigate('Details', task );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>
      <View style={styles.buttonContainer}>
        <Button title="Add Task" onPress={handleAddTask} />
        <Button title="History" onPress={handleFinishedTasks} />
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View style={styles.taskContainer}>
            <TouchableOpacity  onPress={() => handleViewTaskDetails(item)}>
    <Text style={styles.taskDetailsButton}>{item.title}</Text>          
</TouchableOpacity>
              <Button
                title="Mark Finished"
                onPress={() => handleMarkTaskFinished(item.id)}
              />
            </View>

        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskDetailsButton: {
    marginTop: 16,
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;
