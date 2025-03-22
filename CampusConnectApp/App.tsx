import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AuthLoadingScreen from './AuthLoadingScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import EventsScreen from './EventsScreen';
import MapScreen from './MapScreen';
import MessagingScreen from './MessagingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator (Main App)
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Events' :
            iconName = 'calendar-outline';
            break;
            case 'Map' :
            iconName = 'map-outline';
            break;
            case 'Chat' :
            iconName = 'chatbubble-ellipses-outline';
            break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4a6fa5',
        tabBarInactiveTintColor: '#2e3d5f',
        tabBarStyle: {
          backgroundColor: '#0a192f',
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Chat" component={MessagingScreen} />
    </Tab.Navigator>
  );
}

// Main App Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}