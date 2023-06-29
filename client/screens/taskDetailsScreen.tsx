import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

  const TaskDetailsScreen: React.FC<any> = (props) => {
  const navigation = useNavigation();
  const task = props.route.params;
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleDeleteTask = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      await axios.delete(
        `http://192.168.1.2:3000/task/${task.id}/`,
        {
          headers: { Authorization: `${accessToken}` },
        }
      );
      navigation.goBack();
    } catch (error) {
      alert('Error deleting the task:');
    }  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text>Description: {task.description}</Text>
      <Text>Priority: {task.priority}</Text>
      {task.deadline && <Text>Deadline: {task.deadline}</Text>}
      <Button title="Delete" color="red" onPress={handleDeleteTask} />
      <Button title="Back" onPress={handleGoBack} />
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
});

export default TaskDetailsScreen;