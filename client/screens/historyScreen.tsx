import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

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

const HistoryScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigation = useNavigation();

  const fetchFinishedTasks = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const response = await axios.get('http://192.168.1.2:3000/task/finished', {
        headers: { Authorization: `${accessToken}` },
      });
      setTasks(response.data);
    } catch (error) {
      alert('Error retrieving finished tasks');
    }
  };

  useFocusEffect(React.useCallback(() => {
    fetchFinishedTasks();
  },[]));


  const handleBack = () => {
    navigation.goBack();
  };

  const handleMarkTaskUnfinished = async (taskId: string) => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      await axios.patch(
        `http://192.168.1.2:3000/task/${taskId}/`,
        {finished: false},
        {
          headers: { Authorization: `${accessToken}` },
        }
      );
      fetchFinishedTasks();
    } catch (error) {
      alert('Error marking task as unfinished');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finished Tasks</Text>
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={handleBack} />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text>{item.title}</Text>
            <Button
              title="Mark Unfinished"
              onPress={() => handleMarkTaskUnfinished(item.id)}
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
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default HistoryScreen;