import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};

type NavigationProp = StackNavigationProp<AuthStackParamList>;

export default function SignupScreen({ navigation }: { navigation: NavigationProp }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');

  const handleSignup = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Account created');
        navigation.navigate('Login');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error signing up');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Image source={require('../assets/replate-logo.png')} style={styles.logo} />

        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="green" style={styles.icon} />
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={20} color="green" style={styles.icon} />
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

        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Customer" value="customer" />
          <Picker.Item label="Restaurant Owner" value="business" />
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Already have an account?{' '}
          <Text onPress={() => navigation.navigate('Login')} style={styles.link}>
            Log in
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
  input: { flex: 1, height: 40 },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 10,
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
