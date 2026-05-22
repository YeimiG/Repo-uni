import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { Colors } from '../constants/Colors';

import LoginScreen from '../screens/LoginScreen';
import PerfilScreen from '../screens/PerfilScreen';
import ServiciosScreen from '../screens/ServiciosScreen';

import MateriasScreen from '../screens/MateriasScreen.js';
import NotasDetalleScreen from '../screens/NotasScreen.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ route }) {

  const idUsuario = route?.params?.idUsuario;

  return (

    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primaryBlue,
          height: 80,
          borderTopWidth: 0
        },
        tabBarActiveTintColor: Colors.black,
      }}
    >

      <Tab.Screen
        name="Servicios"
        component={ServiciosScreen}
        initialParams={{ idUsuario }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="home"
              size={28}
              color={color}
            />
          )
        }}
      />

      <Tab.Screen
        name="Materias"
        component={MateriasScreen}
        initialParams={{ idUsuario }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="document-text"
              size={28}
              color={color}
            />
          )
        }}
      />

    </Tab.Navigator>
  );
}

export default function AppNavigator() {

  return (

    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
      />

      <Stack.Screen
        name="Perfil"
        component={PerfilScreen}
      />

      <Stack.Screen
        name="NotasDetalle"
        component={NotasDetalleScreen}
      />

    </Stack.Navigator>
  );
}