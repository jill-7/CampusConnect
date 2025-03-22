import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Modal, TextInput, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
};
const default_events = [
  {
    id: '1',
    title: 'Hackathon',
    date: new Date('2025-03-28').toISOString(),
    location: 'Kabarak University Auditorium',
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQozf1YStSOoBXtaqGsY2R0JXYce8Y4bOwH4A&s",

  },
  {
    id: '2',
    title: 'Sports Day',
    date: new Date('2025-03-30').toISOString(),
    location: 'Sports Ground',
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdJgpk8r_4uPJ8ZH1N0yjUomDkYOmHHfTLCw&s",
  },
];

const EventsScreen = ({ navigation }: any) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    location: '',
    image: ''
  });

  
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const savedEvents = await AsyncStorage.getItem('userEvents');
        //if (savedEvents) { 
          const userEvents = savedEvents ? JSON.parse(savedEvents) : [];
          

          setEvents([...default_events,...userEvents]);
          
          
      //}else {
       // setEvents(default_events);
        //await AsyncStorage.setItem('events', JSON.stringify(default_events));
      //}
     } catch (error) {
        console.error('Error loading events:', error);
        setEvents(default_events);
      }
    };
    loadEvents();
  }, []);

  // Save events whenever they change
  useEffect(() => {
    const saveEvents = async () => {
      try {
        const userEvents = events.filter(event => !default_events.some(defaultEvent => defaultEvent.id === event.id));


        await AsyncStorage.setItem('userEvents', JSON.stringify(userEvents));
      } catch (error) {
        console.error('Error saving events:', error);
      }
    };
    saveEvents();
  }, [events]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      setNewEvent(prev => ({
        ...prev,
        image: result.assets[0].uri
      }));
    }

    //if (!result.canceled && result.assets?.[0]?.uri) {
      //setNewEvent({ ...newEvent, image: result.assets[0].uri });
    //}
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

      const updatedEvent = {
      ...newEvent,
      id: editingEvent || Date.now().toString(),
      date: newEvent.date.toISOString() // Store as ISO string
    };

    const updatedEvents = editingEvent 
      ? events.map(event => event.id === editingEvent ? updatedEvent : event)
      : [...events, updatedEvent];


    setEvents(updatedEvents);
    setModalVisible(false);
    setNewEvent({ title: '', date: new Date(), location: '', image: '' });
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event.id);
    setNewEvent({
      title: event.title,
      location: event.location,
      image: event.image,
      date: new Date(event.date)
    });
    setModalVisible(true);
  };

  const RightSwipeActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDeleteEvent(id)}
    >
      <Ionicons name="trash" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => RightSwipeActions(item.id)}
          >
            <TouchableOpacity onPress={() => handleEditEvent(item)}>
              <View style={styles.eventCard}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.eventImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image" size={50} color="#4a6fa5" />
                  </View>
                )}
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventText}>
                    <Ionicons name="calendar" /> {new Date(item.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.eventText}>
                    <Ionicons name="location" /> {item.location}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => {
          setEditingEvent(null);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Event Title"
              placeholderTextColor="#9fb3d6"
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
            />

            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>
                {newEvent.image ? 'Change Image' : 'Add Image'}
              </Text>
            </TouchableOpacity>
            {newEvent.image && (
    <View>
      <Image source={{ uri: newEvent.image }} style={styles.imagePreview} />
      <TouchableOpacity 
        style={styles.tickButton}
        onPress={() => {/* Optional: add confirmation logic here */}}
      >
        <Ionicons name="checkmark-circle" size={40} color="green" />
      </TouchableOpacity>
    </View>
  )}


            <TouchableOpacity 
              style={styles.dateButton} 
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {newEvent.date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={newEvent.date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setNewEvent({ ...newEvent, date: selectedDate });
                }}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Location"
              placeholderTextColor="#9fb3d6"
              value={newEvent.location}
              onChangeText={(text) => setNewEvent({ ...newEvent, location: text })}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => {
                  setModalVisible(false);
                  setNewEvent({ title: '', date: new Date(), location: '', image: '' });
                  setEditingEvent(null);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleSaveEvent}
              >
                <Text style={styles.buttonText}>
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a192f',
    padding: 10,
  },
  eventCard: {
    backgroundColor: '#1a2a4a',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#0a192f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDetails: {
    padding: 15,
  },
  eventTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventText: {
    color: '#9fb3d6',
    fontSize: 16,
    marginBottom: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4a6fa5',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#1a2a4a',
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#0a192f',
    color: 'white',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: '#4a6fa5',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dateButton: {
    backgroundColor: '#0a192f',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
  },
  dateButtonText: {
    color: '#9fb3d6',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 5,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#2e3d5f',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4a6fa5',
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 10,
  },
  tickButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },

  deleteButton: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 10,
    marginBottom: 15,
  },
});

export default EventsScreen;