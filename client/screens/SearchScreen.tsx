import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome, Entypo } from '@expo/vector-icons';

import BottomNavBar from '../components/BottomNavBar';
import type { RootStackParamList } from '../App';

/* ---------- nav helper ---------- */
type NavigationProp = StackNavigationProp<RootStackParamList>;

/* ---------- constants ---------- */
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_SPACE = 20;
const CARD_SIZE  = Math.min((SCREEN_WIDTH - 16 * 2 - CARD_SPACE * 2) / 3, 120);
const IMG_SIZE   = CARD_SIZE * 0.75;
const GREEN  = '#2E8B57';
const BEIGE  = '#fdf8ef';
const BUBBLE = '#c4f1c4';
const NAV_BAR_HEIGHT = 60;

export default function SearchScreen({ navigation }: { navigation: NavigationProp }) {
  const [query, setQuery]     = useState('');
  const [focused, setFocused] = useState(false);
  const [recents, setRecents] = useState<string[]>(['Sushi', 'Burger', 'Falafel']);
  const [results, setResults] = useState<{ id: string; name: string }[]>([]);

  const handleSearch = async (term: string) => {
    const clean = term.trim();
    if (!clean) return;

    // save recent searches
    setRecents(prev => [clean, ...prev.filter(x => x !== clean)].slice(0, 10));
    setQuery(clean);

    try {
      const res = await fetch('http://localhost:5000/api/restaurants');
      const { restaurants } = await res.json();

      // filter by name
      const filtered = (restaurants as any[])
        .filter(r =>
          r.business_name
            .toLowerCase()
            .includes(clean.toLowerCase())
        )
        .map(r => ({
          id: r.id.toString(),
          name: r.business_name,
        }));

      setResults(filtered);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* search bar */}
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name="chevron-left" size={28} color={GREEN} />
          </TouchableOpacity>

          <View style={styles.searchInputWrapper}>
            <TextInput
              placeholder="What are you craving?"
              placeholderTextColor="#666"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              returnKeyType="search"
              onSubmitEditing={() => handleSearch(query)}
            />
            {!focused && query.length === 0 && (
              <FontAwesome
                name="search"
                size={18}
                color="#666"
                style={styles.searchIcon}
              />
            )}
          </View>
        </View>

        {/* recent */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Recent</Text>
          {recents.length > 0 && (
            <TouchableOpacity onPress={() => setRecents([])}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        {recents.length
          ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 8 }}
            >
              {recents.map(term => (
                <TouchableOpacity
                  key={term}
                  style={styles.bubble}
                  onPress={() => handleSearch(term)}
                >
                  <Text style={styles.bubbleText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )
          : <Text style={{ color: '#666', marginBottom: 8 }}>No recent searches</Text>
        }

        {/* categories (unchanged) */}
        {/* … your existing categories FlatList … */}

        {/* results */}
        {results.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
              Restaurants
            </Text>
            <FlatList
              data={results}
              keyExtractor={r => r.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultRow}
                  onPress={() =>
                    navigation.navigate('FoodListing', { id: item.id })
                  }
                >
                  <View style={styles.resultThumb} />
                  <Text style={styles.resultText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </ScrollView>

      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BEIGE },
  scroll: { paddingHorizontal: 16, paddingBottom: NAV_BAR_HEIGHT + 40 },

  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  searchInputWrapper: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#eee8f9',
    borderRadius: 22,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchInput: { flex: 1, fontSize: 16 },
  searchIcon: { marginLeft: 6 },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  clearText: { color: '#007bff', fontSize: 14 },

  bubble: {
    backgroundColor: BUBBLE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 12,
  },
  bubbleText: { color: '#000', fontSize: 14 },

  card: { width: CARD_SIZE, alignItems: 'center' },
  cardImg: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    borderRadius: 12,
    backgroundColor: '#cde8de',
  },
  cardLabel: { marginTop: 4, fontSize: 13, color: '#000' },

  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultThumb: {
    width: 50,
    height: 50,
    backgroundColor: '#d8eee5',
    borderRadius: 8,
    marginRight: 12,
  },
  resultText: { fontSize: 16 },
});
