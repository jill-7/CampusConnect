import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { db, auth } from './firebaseConfig';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp} from 'firebase/firestore';
import { and, or } from 'firebase/firestore';


type Message = {
  id: string;
  text: string;
  createdAt: Date;
  isUser: boolean;
  senderId: string;
};



const MessagingScreen = ({ route }: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<KeyboardAwareFlatList>(null);

  const otherUserId  = route?.params?.otherUserId || 'user2';
  const currentUserId = auth.currentUser?.uid || 'user1';
 

  useEffect(()  => {

    if (!currentUserId || !otherUserId) return;

    const messagesQuery = query(
      collection(db, 'messages'),
      or(
        and(
         where('senderId', '==', currentUserId),
         where('receiverId', '==', otherUserId)
        ),
        and(
          where('senderId', '==', otherUserId),
          where('receiverId', '==', currentUserId)
         )
        ),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const loadedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        loadedMessages.push({
          id: doc.id,
          text: data.text,
          createdAt: data.createdAt?.toDate() || new Date(),
          isUser: data.senderId === currentUserId, // Styles bubbles correctly
          senderId: data.senderId,
        });
      });
      console.log("ALL MESSAGES:", loadedMessages);
      setMessages(loadedMessages);
    });

    return unsubscribe; // Stop listening when screen closes
  }, [currentUserId, otherUserId]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(db, 'messages'), {
        senderId: currentUserId,
        receiverId: otherUserId,
        text: newMessage,
        createdAt: serverTimestamp(), // Auto-sets time
      });
      setNewMessage(''); // Clear input
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