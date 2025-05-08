/* -------------------------------------------------------------------------- */
/*  AdminHomeScreen.tsx                                                       */
/* -------------------------------------------------------------------------- */
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomNavBar from '../components/BottomNavBar';
import type { RootStackParamList } from '../App';

type Nav = StackNavigationProp<RootStackParamList, 'AdminHome'>;

export default function AdminHomeScreen({ navigation }: { navigation: Nav }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.h1}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, Administrator!</Text>
      </View>
      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fdf8ef' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  h1: { fontSize: 26, fontWeight: '700', marginBottom: 8, color: '#2E8B57' },
  subtitle: { fontSize: 16, color: '#555' },
});
