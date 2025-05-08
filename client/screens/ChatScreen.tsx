/* -------------------------------------------------------------------------- */
/*  ChatScreen.tsx                                                            */
/* -------------------------------------------------------------------------- */
import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import { AiService } from '../services/aiService';
import BottomNavBar from '../components/BottomNavBar';
import type { RootStackParamList } from '../App';

type Nav = StackNavigationProp<RootStackParamList, 'Chat'>;

interface Props { navigation: Nav; }

interface Msg {
  from: 'user' | 'ai';
  text: string;
}

const GREEN = '#2E8B57';
const BG    = '#fdf8ef';

export default function ChatScreen({ navigation }: Props) {
  const [prompt, setPrompt]   = useState('');
  const [messages, setMsgs]   = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const send = async () => {
    const clean = prompt.trim();
    if (!clean || loading) return;

    setMsgs((m) => [...m, { from: 'user', text: clean }]);
    setPrompt('');
    setLoading(true);

    try {
      const reply = await AiService.ask(clean);
      setMsgs((m) => [...m, { from: 'ai', text: reply }]);
    } catch (err: any) {
      setMsgs((m) => [
        ...m,
        { from: 'ai', text: err.message || 'Error contacting AI' },
      ]);
    } finally {
      setLoading(false);
      // scroll to bottom after render
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 0);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* chat area */}
      <ScrollView
        style={{ flex: 1 }}
        ref={scrollRef}
        contentContainerStyle={styles.chatPad}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((m, idx) => (
          <View
            key={idx}
            style={[styles.bubble, m.from === 'user' ? styles.me : styles.bot]}
          >
            <Text style={styles.msg}>{m.text}</Text>
          </View>
        ))}

        {loading && (
          <View style={[styles.bubble, styles.bot]}>
            <Text style={styles.msg}>…</Text>
          </View>
        )}
      </ScrollView>

      {/* input bar */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type your question…"
          value={prompt}
          onChangeText={setPrompt}
          onSubmitEditing={send}
          editable={!loading}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send} disabled={loading}>
          <FontAwesome name="paper-plane" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/*  styles                                                            */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: BG },
  chatPad: { padding: 16, paddingBottom: 80 },

  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  me:  { backgroundColor: '#d0f0d0', alignSelf: 'flex-end' },
  bot: { backgroundColor: '#fff',     alignSelf: 'flex-start' },
  msg: { fontSize: 16 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  input: { flex: 1, fontSize: 16, padding: 8 },
  sendBtn: {
    backgroundColor: GREEN,
    borderRadius: 24,
    padding: 12,
    marginLeft: 8,
  },
});
