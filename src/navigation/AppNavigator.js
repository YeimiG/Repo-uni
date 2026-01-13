import { Ionicons } from '@expo/vector-icons'; // Si usas Expo
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { Colors } from '../constants/Colors';
import LoginScreen from '../screens/LoginScreen';
import NotasScreen from '../screens/NotasScreen';
import PerfilScreen from '../screens/PerfilScreen';
import ServiciosScreen from '../screens/ServiciosScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();     

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: Colors.primaryBlue, height: 80, borderTopWidth: 0 },
      tabBarActiveTintColor: Colors.black,
    }}>
      <Tab.Screen name="Principal" component={ServiciosScreen} 
        options={{ tabBarIcon: ({color}) => <Ionicons name="home" size={28} color={color} /> }} />
      <Tab.Screen name="Notas" component={NotasScreen} 
        options={{ tabBarIcon: ({color}) => <Ionicons name="document-text" size={28} color={color} /> }} />
        <Tab.Screen name="settings" component={ServiciosScreen} 
        options={{ tabBarIcon: ({color}) => <Ionicons name="settings" size={28} color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Servicios" component={ServiciosScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
    </Stack.Navigator>
  );
}