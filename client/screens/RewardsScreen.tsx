/* -------------------------------------------------------------------------- */
/*  RewardsScreen.tsx                                                         */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

import BottomNavBar from '../components/BottomNavBar';
import type { RootStackParamList } from '../App';

/* -------------------------------------------------------------------------- */
type Nav = StackNavigationProp<RootStackParamList, 'Rewards'>;

/* colours */
const GREEN = '#2E8B57';
const BEIGE = '#fdf8ef';
const CARD_BG = '#c6f1d9';
const ORANGE = '#ff8c00';

/* static rewards */
const REWARDS = [
  { id: 'free-del', label: 'Free Delivery', cost: 300 },
  { id: 'free-bev', label: 'Free Beverage', cost: 1000 },
  { id: 'free-app', label: 'Free Appetizer', cost: 3800 },
];

export default function RewardsScreen({ navigation }: { navigation: Nav }) {
  const [points, setPoints] = useState<number>(0);

  /* fetch points once */
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/points', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && typeof data.points === 'number') setPoints(data.points);
      } catch (err) {
        console.error('Fetch points error', err);
      }
    })();
  }, []);

  /* for future: claim reward handler */
  const redeem = (cost: number) =>
    alert(
      cost <= points
        ? 'Redeem flow goes here!'
        : `You need ${cost - points} more points`
    );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        {/* top icons row */}
        <View style={styles.headerRow}>
          <FontAwesome name="user-circle-o" size={28} color={GREEN} />
          <View style={{ flexDirection: 'row', gap: 24 }}>
            <MaterialIcons name="mark-email-unread" size={26} color={GREEN} />
            <MaterialIcons name="notifications-none" size={26} color={GREEN} />
          </View>
        </View>

        {/* circular points badge */}
        <View style={styles.pointsWrapper}>
          <View style={styles.pointsCircle}>
            <Text style={styles.pointsText}>{points}</Text>
            <Text style={styles.brandText}>RePlate</Text>
          </View>
        </View>

        {/* reward cards */}
        {REWARDS.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={styles.rewardCard}
            activeOpacity={0.8}
            onPress={() => redeem(r.cost)}
          >
            <Text style={styles.rewardLabel}>{r.label}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{r.cost} pts</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* how-it-works bubble */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLine}>1. Earn points with every order</Text>
          <Text style={styles.infoLine}>2. Redeem points for great rewards</Text>
          <Text style={styles.infoLine}>3. Enjoy your delicious free food!</Text>
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
  safe: { flex: 1, backgroundColor: BEIGE },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },

  /* badge copied from Home */
  pointsWrapper: { alignItems: 'center', marginVertical: 20 },
  pointsCircle: {
    borderWidth: 2,
    borderColor: GREEN,
    borderRadius: 100,
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsText: { fontSize: 38, fontWeight: '700', color: ORANGE },
  brandText: { fontSize: 22, color: GREEN, fontStyle: 'italic' },

  /* reward cards */
  rewardCard: {
    backgroundColor: CARD_BG,
    marginHorizontal: 32,
    marginBottom: 18,
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardLabel: { fontSize: 16, fontWeight: '600' },
  badge: {
    backgroundColor: ORANGE,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  badgeText: { color: '#fff', fontWeight: '700' },

  /* info bubble */
  infoBox: {
    backgroundColor: '#eef7f0',
    marginHorizontal: 32,
    borderRadius: 16,
    padding: 14,
    marginTop: 24,
  },
  infoLine: { fontSize: 13, color: '#555' },
});
