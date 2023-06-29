import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import ValidationService from '../services/validationService';

const SignInScreen:React.FC<any> = ({navigation})  => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSignIn = async (): Promise<void> => {
    try {
      if (await ValidationService.validateUserSignInSchema({ usernameOrEmail, password })) {
        const response = await axios.post<{ accessToken: string; refreshToken: string }>(
          'http://192.168.1.2:3000/user/signin',
          { usernameOrEmail, password }
        );
        await SecureStore.setItemAsync('accessToken', response.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
        setUsernameOrEmail('');
        setPassword('');
        navigation.navigate('Home');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      alert('Login error');
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          value={usernameOrEmail}
          onChangeText={setUsernameOrEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <Button title="Login" onPress={handleSignIn} />
      <TouchableOpacity onPress={handleSignUp}>
        <Text style={styles.signUpButton}>Sign Up</Text>
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
    flexShrink: 1,
  },
  signUpButton: {
    marginTop: 16,
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default SignInScreen;
