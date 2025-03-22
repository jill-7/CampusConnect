import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

type Message = {
  id: string;
  text: string;
  createdAt: Date;
  isUser: boolean;
};

const default_response = "I cannot assist with that. Please ask for something else :)";
const BOT_RESPONSES = [
  {
    keywords: ['hello', 'hi', 'hey'],
    responses: ['Hi there!', 'Hello!', 'Hey! 👋']
  },
  {
    keywords: ['help', 'support'],
    responses: ['How can I assist you?', 'What do you need help with?']
  },
  {
    keywords: ['thanks', 'thank you'],
    responses: ['You\'re welcome!', 'Happy to help! 😊']
  },
  {
    keywords: ['event', 'events'],
    responses: ['Head to the events tab', 'You can find that information on the events tab']
  },
  {
    keywords: ['map', 'directions'],
    responses: ['Our app has coordinates that i think will be helpful to you', 'Do not hesitate to ask for help']
  },
  {
    keywords: ['name', 'call'],
    responses: ['I am a chatbot', 'You can call me whatever you wish :)']
  },
  {
    keywords: ['bye', 'goodbye'],
    responses: ['Goodbye!', 'See you later! 👋']
  },
  {
    keywords: ['*'],
    responses: [default_response]
  },
  

];



const MessagingScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome! How can I assist you today?',
      createdAt: new Date(),
      isUser: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<KeyboardAwareFlatList>(null);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: newMessage,
        createdAt: new Date(),
        isUser: true,
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      const userText = newMessage.toLowerCase();
      let responses: string[] = [];
      
      for (const rule of BOT_RESPONSES) {
        if (rule.keywords.includes('*') || 
            rule.keywords.some(keyword => userText.includes(keyword))) {
          responses = rule.responses;
          break;
        }
      }
  

      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          createdAt: new Date(),
          isUser: false,
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);

    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageBubble,
      item.isUser ? styles.sentMessage : styles.receivedMessage,
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timeText}>
        {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={-150}
    >
      <KeyboardAwareFlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingBottom: 60 }}
        keyboardShouldPersistTaps = 'handled'
        onLayout={() => 
          flatListRef.current?.scrollToEnd()
        }
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity 
          onPress={sendMessage} 
          style={styles.sendButton}
          disabled={!newMessage.trim()}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={newMessage.trim() ? "#4a6fa5" : "#666"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a192f',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  sentMessage: {
    backgroundColor: '#4a6fa5',
    alignSelf: 'flex-end',
    marginRight: 5,

  },
  receivedMessage: {
    backgroundColor: '#1a2a4a',
    alignSelf: 'flex-start',
    marginLeft: 5,

  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  timeText: {
    color: '#9fb3d6',
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: '#1a2a4a',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: '#0a192f',
    color: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    padding: 7,
  },
});

export default MessagingScreen;