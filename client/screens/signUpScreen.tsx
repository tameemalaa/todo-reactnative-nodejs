import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text,TouchableOpacity } from 'react-native';
import axios from 'axios';
import ValidationService from '../services/validationService';
import { baseURL } from '../config';

const SignUpScreen: React.FC<any> = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const handleSignUp = async (): Promise<void> => {
    if (password !== rePassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      if (await ValidationService.validateUserSignUpSchema({ username: username, email: email, password: password, rePassword: rePassword })) {
        const response = await axios.post(`${baseURL}/user/signup`, {
          username,
          email,
          password,
          rePassword,
        });
        setUsername('');
        setEmail('');
        setPassword('');
        setRePassword('');
        if (response.status === 201) {
          alert('Signup successful');
          navigation.navigate('SignIn');
        }
        else{
          alert("Signup error");
        }
      } else {
        alert('Invalid Signup details');
      }
    } catch (error) {
      alert("Signup error");
    }
  };

  const handleLogin = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Re-enter Password"
          value={rePassword}
          onChangeText={setRePassword}
          secureTextEntry
        />
      </View>
      <Button title="Signup" onPress={handleSignUp} />
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.signInButton}>login</Text>
      </TouchableOpacity>
    </View>
    
      );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 32,
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
    paddingHorizontal: 10,
  },
  signInButton: {
    marginTop: 16,
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;
