import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import ValidationService from '../services/validationService';
import { baseURL } from '../config';

const AddTaskScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState(4);
  const navigation = useNavigation();

  const handleAddTask = async () => {
    try {
      const task ={
        title: title,
        description: description,
        finished: false,
        deadline: deadline ? deadline : undefined,
        priority: priority,
      }
    if ( await ValidationService.validatePostTaskSchema(task)){
      const accessToken = await SecureStore.getItemAsync('accessToken');
      await axios.post(
        `${baseURL}/task`,
        task,
        {
          headers: { Authorization: `${accessToken}` },
        }
      );
      navigation.goBack();}
      else{
        alert("Invalid input")
      }
    } catch (error) {
      alert('Error adding task');
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Deadline (optional)"
        value={deadline}
        onChangeText={(text) => setDeadline(text)}
      />
      <Text style={styles.label}>Priority:</Text>
      <View style={styles.priorityContainer}>
        {[1, 2, 3, 4].map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.priorityButton,
              priority === value ? styles.priorityButtonSelected : null,
            ]}
            onPress={() => setPriority(value)}
          >
            <Text>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Add Task" onPress={handleAddTask} />
      <Button title="Go Back" onPress={handleGoBack} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priorityButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 8,
  },
  priorityButtonSelected: {
    backgroundColor: 'lightblue',
  },
});

export default AddTaskScreen;
