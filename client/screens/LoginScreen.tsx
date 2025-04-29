import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};

type NavigationProp = StackNavigationProp<AuthStackParamList>;

export default function LoginScreen({ navigation }: { navigation: NavigationProp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        navigation.navigate('Home');
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      alert('Error during login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Image source={require('../assets/replate-logo.png')} style={styles.logo} />

        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="green" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="green" style={styles.icon} />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity onPress={() => alert("Forgot password feature coming soon!")}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          New to Replate?{' '}
          <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf8ef', // soft beige tone
    padding: 20,
  },
  
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
    alignSelf: 'center',
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
  },
  icon: { marginRight: 10 },
  input: { 
    flex: 1, 
    height: 40 
  },
  forgot: { 
    color: '#007bff', 
    alignSelf: 'flex-end', 
    marginBottom: 20 
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  bottomText: { 
    marginTop: 30, 
    textAlign: 'center' 
  },
  link: { 
    color: '#007bff' 
  },
});
