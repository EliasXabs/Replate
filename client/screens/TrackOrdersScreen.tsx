/* -------------------------------------------------------------------------- */
/*  TrackOrdersScreen.tsx                                                     */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from '../components/BottomNavBar';
import type { RootStackParamList } from '../App';

type Nav = StackNavigationProp<RootStackParamList, 'TrackOrders'>;

interface OrderSummary {
  id: number;
  status: string;
  createdAt: string;
  total: number;
}

export default function TrackOrdersScreen({ navigation }: { navigation: Nav }) {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  /* fetch all orders for current user */
  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const res = await fetch('http://localhost:5000/api/order', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      /* shape for UI */
      const formatted: OrderSummary[] = data.map((o: any) => ({
        id: o.id,
        status: o.orderStatus?.status_name || o.status_name || 'unknown',
        createdAt: o.createdAt,
        total: Number(o.total_price),
      }));
      setOrders(formatted.reverse()); // newest first
    } catch (err) {
      console.error('Fetch orders error', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  /* render one card */
  const renderItem = ({ item }: { item: OrderSummary }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('OrderStatus', { id: item.id.toString() })}
      activeOpacity={0.8}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.idText}>Order #{item.id}</Text>
        <Text style={styles.dateText}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.status, statusColor(item.status)]}>{item.status}</Text>
        <Text style={styles.total}>${item.total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 16 }}>You have no orders yet.</Text>
          </View>
        )}
      />
      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*  styles + helpers                                                          */
/* -------------------------------------------------------------------------- */
const GREEN = '#2E8B57';
const BG = '#fdf8ef';
const CARD = '#e9f7f2';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  card: {
    backgroundColor: CARD,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  idText: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  dateText: { fontSize: 14, color: '#555' },
  status: { fontSize: 14, fontWeight: '600', textTransform: 'capitalize' },
  total: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  emptyBox: { flex: 1, alignItems: 'center', marginTop: 100 },
});

/* tint status colours */
function statusColor(status: string) {
  switch (status) {
    case 'pending':
      return { color: '#e6b800' };
    case 'confirmed':
      return { color: '#007bff' };
    case 'delivered':
      return { color: '#2E8B57' };
    default:
      return { color: '#555' };
  }
}
