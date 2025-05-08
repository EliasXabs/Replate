// 👈 FIRST import – init Gesture‑Handler
import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, Text } from 'react-native';

import { CartProvider } from './context/CartContext';

/* ── real screens ─────────────────────────────────────────────────────── */
import LoginScreen          from './screens/LoginScreen';
import SignupScreen         from './screens/SignupScreen';
import HomePage             from './screens/HomeScreen';
import SearchScreen         from './screens/SearchScreen';
import RestaurantListScreen from './screens/RestaurantListScreen';
import FoodListingScreen    from './screens/FoodListingScreen';
import FoodDetailScreen     from './screens/FoodDetailScreen';
import CartScreen           from './screens/CartScreen';
import CheckoutScreen       from './screens/CheckoutScreen';
import OrderStatusScreen    from './screens/OrderStatusScreen';
import TrackOrdersScreen    from './screens/TrackOrdersScreen';
import NewOnReplateScreen from './screens/NewOnReplateScreen';
import RewardsScreen from './screens/RewardsScreen';

/* ── stack param list ─────────────────────────────────────────────────── */
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;

  /* feature pages without params */
  Account: undefined;
  NewOnReplate: undefined;
  Location: undefined;
  Checkout: undefined;
  Cart: undefined;
  TrackOrder: undefined;
  TrackOrders: undefined;
  Notifications: undefined;
  OrderConfirmation: undefined;
  Rewards: undefined;

  /* pages with params */
  ComboDetails:          { id: string };
  RecommendationDetails: { id: string };
  RestaurantList:        { category?: string };
  FoodListing:           { id: string };
  FoodDetail:            { id: string };
  OrderStatus: { id: string };

  /* search */
  Search: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

/* ---- tiny placeholders until you build real UIs ---------------------- */
const Placeholder = (label: string) => () =>
  <SafeAreaView><Text style={{ padding: 20 }}>{label}</Text></SafeAreaView>;

const AccountScreen      = Placeholder('Account screen');

/* ── app component ────────────────────────────────────────────────────── */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* ➋ Wrap ALL navigation with the cart provider */}
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false}}>
            {/* auth & landing */}
            <Stack.Screen name="Login"  component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Home"   component={HomePage} />

            {/* static feature pages */}
            <Stack.Screen name="Account"      component={AccountScreen} />
            <Stack.Screen name="NewOnReplate" component={NewOnReplateScreen} />

            {/* search & listings */}
            <Stack.Screen name="Search"         component={SearchScreen} />
            <Stack.Screen name="RestaurantList" component={RestaurantListScreen} />
            <Stack.Screen name="FoodListing"    component={FoodListingScreen} />
            <Stack.Screen name="FoodDetail"     component={FoodDetailScreen} />
            <Stack.Screen name="Cart"           component={CartScreen} />
            <Stack.Screen name="Checkout"       component={CheckoutScreen} />
            <Stack.Screen name="OrderStatus" component={OrderStatusScreen} />
            <Stack.Screen name="TrackOrders"   component={TrackOrdersScreen} />
            <Stack.Screen name="Rewards" component={RewardsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </GestureHandlerRootView>
  );
}
