/* -------------------------------------------------------------------------- */
/*  BusinessHomeScreen.tsx                                                    */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

type Nav = StackNavigationProp<RootStackParamList, 'BusinessHome'>;

/* palette */
const GREEN = '#2E8B57';
const BG    = '#fdf8ef';

interface Order {
  id: number;
  createdAt: string;
  status_id: number;
  status_name: string;
  total_price: string;
}

export default function BusinessHomeScreen({ navigation }: { navigation: Nav }) {
  const [todayCnt, setTodayCnt] = useState<number | null>(null);
  const [yestCnt,  setYestCnt]  = useState<number | null>(null);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const sameDay = (d1: Date, d2: Date) =>
    d1.toISOString().slice(0, 10) === d2.toISOString().slice(0, 10);

  /* fetch dashboard ---------------------------------------------------- */
  const fetchDashboardData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      /* user id */
      const me   = await fetch('http://localhost:5000/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());
      const uid  = Number(me.user?.id);
      if (isNaN(uid)) return;

      /* owned restaurants */
      const restaurants: any[] = (await fetch(
        'http://localhost:5000/api/restaurants',
        { headers: { Authorization: `Bearer ${token}` } }
      ).then((r) => r.json())).restaurants;

      const myRest = restaurants.filter((r) => Number(r.user_id) === uid);

      /* orders */
      const ordersArrays = await Promise.all(
        myRest.map((r) =>
          fetch(`http://localhost:5000/api/order/restaurant/${r.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json())
        )
      );
      const all: Order[] = ordersArrays.flat().sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(all);

      /* today / yesterday count */
      const now  = new Date();
      const prev = new Date(now); prev.setDate(now.getDate() - 1);
      let t = 0, y = 0;
      all.forEach((o) => {
        const d = new Date(o.createdAt);
        if (sameDay(d, now)) t++; else if (sameDay(d, prev)) y++;
      });
      setTodayCnt(t); setYestCnt(y);
    } catch (err) {
      console.error('dashboard fetch err', err);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);
  const onRefresh = async () => { setRefreshing(true); await fetchDashboardData(); setRefreshing(false); };

  /* update status ------------------------------------------------------ */
  const updateStatus = async (orderId: number, statusId: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      await fetch(`http://localhost:5000/api/order/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ statusId }),
      });

      fetchDashboardData();
    } catch (e) { console.error('update status err', e); }
  };

  /* log-out ------------------------------------------------------------ */
  const logOut = async () => {
    await AsyncStorage.multiRemove(['authToken', 'userRole']);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' as keyof RootStackParamList }],
    });
  };

  /* ------------------------------------------------------------------ */
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.pad}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* headline card */}
        <View style={styles.card}>
          <Text style={styles.big}>{todayCnt ?? '—'}</Text>
          <Text style={styles.label}>Orders today</Text>
          {yestCnt != null && <Text style={styles.sub}>Yesterday: {yestCnt}</Text>}
        </View>

        {/* orders list */}
        <Text style={styles.section}>Orders</Text>
        {orders.map((o) => {
          const time = new Date(o.createdAt).toLocaleTimeString();
          return (
            <View key={o.id} style={styles.orderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderId}>#{o.id}</Text>
                <Text style={styles.orderMeta}>{time} • {Number(o.total_price).toFixed(2)} $</Text>
                <Text style={styles.orderStatus}>{o.status_name}</Text>
              </View>

              {o.status_id === 1 && (
                <TouchableOpacity
                  style={styles.btnAccept}
                  onPress={() => updateStatus(o.id, 2)}
                ><Text style={styles.btnText}>Accept</Text></TouchableOpacity>
              )}
              {o.status_id === 2 && (
                <TouchableOpacity
                  style={styles.btnDeliver}
                  onPress={() => updateStatus(o.id, 3)}
                ><Text style={styles.btnText}>Delivered</Text></TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* floating LOG-OUT */}
      <TouchableOpacity style={styles.logoutFab} onPress={logOut}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*  styles                                                                    */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  pad:  { padding: 16, paddingBottom: 140 },

  card: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  big:   { fontSize: 60, fontWeight: '700', color: GREEN },
  label: { fontSize: 18, fontWeight: '600', marginTop: 4 },
  sub:   { fontSize: 14, color: '#777', marginTop: 4 },

  section: { fontSize: 20, fontWeight: '600', marginBottom: 8 },

  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },
  orderId:     { fontSize: 18, fontWeight: '700' },
  orderMeta:   { fontSize: 14, color: '#555' },
  orderStatus: { fontSize: 14, color: '#999' },

  btnAccept: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnDeliver: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontWeight: '700' },

  /* floating logout FAB */
  logoutFab: {
    position: 'absolute',
    right: 20,
    bottom: 100,            // above BottomNavBar
    backgroundColor: '#ff5252',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 4,
  },
  logoutText: { color: 'white', fontWeight: '700', fontSize: 16 },
});
