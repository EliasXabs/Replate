/* -------------------------------------------------------------------------- */
/*  OrderStatusScreen.tsx                                                     */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../App';
import BottomNavBar from '../components/BottomNavBar';

type Nav = StackNavigationProp<RootStackParamList, 'OrderStatus'>;
type Rte = RouteProp<RootStackParamList, 'OrderStatus'>;

interface Props {
  navigation: Nav;
  route: Rte;
}

interface DisplayItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderDisplay {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  items: DisplayItem[];
}

export default function OrderStatusScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const [order, setOrder] = useState<OrderDisplay | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchOrder = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      /* 1️⃣ fetch order */
      const res = await fetch(`http://localhost:5000/api/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      /* 2️⃣ fetch menu once, build id→name map */
      const menuRes = await fetch(
        `http://localhost:5000/api/menu/${data.business_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const menu: any[] = await menuRes.json();
      const nameMap: Record<number, string> = {};
      menu.forEach((m) => (nameMap[m.id] = m.name));

      /* 3️⃣ shape data for UI */
      const items: DisplayItem[] = data.orderItems.map((it: any) => ({
        name: nameMap[it.menu_item_id] || `Item #${it.menu_item_id}`,
        quantity: it.quantity,
        price: Number(it.price),
      }));

      setOrder({
        id: data.id.toString(),
        status: data.orderStatus?.status_name || 'unknown',
        createdAt: data.createdAt,
        total: Number(data.total_price),
        items,
      });
    };

    fetchOrder(); // initial
    interval = setInterval(fetchOrder, 5000); // poll every 5 s
    return () => clearInterval(interval);
  }, [id]);

  /* loading */
  if (!order) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Loading order…</Text>
      </SafeAreaView>
    );
  }

  /* render */
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.pad}>
        <Text style={styles.h1}>Order #{order.id}</Text>
        <Text>
          Status: <Text style={styles.bold}>{order.status}</Text>
        </Text>
        <Text>Placed: {new Date(order.createdAt).toLocaleString()}</Text>

        <Text style={[styles.h2, { marginTop: 16 }]}>Items</Text>
        {order.items.map((it, idx) => (
          <Text key={idx} style={styles.itemRow}>
            • {it.name} × {it.quantity}
          </Text>
        ))}

        <Text style={[styles.h2, { marginTop: 16 }]}>
          Total&nbsp;&nbsp;{order.total.toFixed(2)} $
        </Text>

        {order.status === 'delivered' && (
          <Text style={{ marginTop: 24, fontWeight: '600' }}>
            Enjoy your meal! 🎉
          </Text>
        )}
      </ScrollView>
      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*  styles                                                                    */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fdf8ef' },
  pad: { padding: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  h1: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  h2: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  itemRow: { fontSize: 16, marginBottom: 4 },
  bold: { fontWeight: '700' },
});
