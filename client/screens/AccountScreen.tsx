/* -------------------------------------------------------------------------- */
/*  AccountScreen.tsx                                                         */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BottomNavBar from '../components/BottomNavBar';
import type { RootStackParamList } from '../App';

/* navigation type */
type Nav = StackNavigationProp<RootStackParamList, 'Account'>;

/* colours */
const GREEN = '#2E8B57';
const BG = '#fdf8ef';
const CARD = '#e8f7ee';

interface User {
  name: string;
  email: string;
  role: string;
}

export default function AccountScreen({ navigation }: { navigation: Nav }) {
  const [user, setUser] = useState<User | null>(null);

  /* fetch current user profile */
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;

        const res = await fetch('http://localhost:5000/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser({ name: data.name, email: data.email, role: data.role });
      } catch (err) {
        console.error('Fetch user error', err);
      }
    })();
  }, []);

  const logOut = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' as keyof RootStackParamList }],
    });
  };

  /* small helper row */
  const Row = ({
    icon,
    label,
    onPress,
  }: {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      {icon}
      <Text style={styles.rowText}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#555" style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        {/* header */}
        <View style={styles.avatarCard}>
          <FontAwesome name="user-circle-o" size={80} color={GREEN} />
          {user ? (
            <>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
              <Text style={styles.roleTag}>{user.role}</Text>
            </>
          ) : (
            <Text style={{ marginTop: 8 }}>Loading profile…</Text>
          )}
        </View>

        {/* links */}
        <View style={styles.section}>
          <Row
            icon={<MaterialIcons name="redeem" size={22} color={GREEN} />}
            label="Rewards & Points"
            onPress={() => navigation.navigate('Rewards')}
          />
          <Row
            icon={<MaterialIcons name="receipt-long" size={22} color={GREEN} />}
            label="Track Orders"
            onPress={() => navigation.navigate('TrackOrders')}
          />
          <Row
            icon={<MaterialIcons name="edit" size={22} color={GREEN} />}
            label="Edit Profile"
            onPress={() => Alert.alert('Coming soon', 'Profile editing is not implemented yet')}
          />
        </View>

        {/* logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logOut}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* ideas box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLine}>Future ideas:</Text>
          <Text style={styles.infoLine}>• Manage addresses & payment methods</Text>
          <Text style={styles.infoLine}>• Notification preferences</Text>
          <Text style={styles.infoLine}>• Dark-mode toggle</Text>
          <Text style={styles.infoLine}>• Delete account</Text>
        </View>
      </ScrollView>

      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*  styles                                                                    */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  avatarCard: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: CARD,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  name: { fontSize: 22, fontWeight: '700', marginTop: 12 },
  email: { fontSize: 14, color: '#555', marginTop: 2 },
  roleTag: {
    marginTop: 6,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#d7efe2',
    overflow: 'hidden',
  },

  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  rowText: { fontSize: 16, marginLeft: 14 },

  logoutBtn: {
    marginTop: 30,
    alignSelf: 'center',
    backgroundColor: '#ee5555',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 24,
  },
  logoutText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  infoBox: {
    marginHorizontal: 16,
    marginTop: 28,
    backgroundColor: '#f0f6f2',
    borderRadius: 12,
    padding: 14,
  },
  infoLine: { fontSize: 13, color: '#555', marginBottom: 3 },
});
