import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AboutUs from "../components/aboutUs";
import AccountPage from '../components/accountPage';
import ContactUs from "../components/contactUs";
import Maps from '../components/maps';
import HomeScreen from '../components/home';
import Login from '../components/login';
import Notification from "../components/notification";
import ProfileScreen from '../components/profile';
import Setting from "../components/setting";
import SignUp from '../components/signUp';
import WifiTest from "../components/wifiTest"
// import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Guide") iconName = "grid-outline";
          else if (route.name === "Maps") iconName = "map-outline";
          else if (route.name === "Account") iconName = "finger-print-outline";
          else if (route.name === "Profile") iconName = "person-circle-outline";
          else if (route.name === "WifiTest") iconName = "person-circle-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#60A5FA",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          height: 50,
          paddingBottom: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Guide" component={HomeScreen} />
      <Tab.Screen name="Maps" component={Maps} />
      <Tab.Screen name="Account" component={AccountPage} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="WifiTest" component={WifiTest} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* <NavigationContainer> */}
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainApp" component={MainTabs} />
            <Stack.Screen name="Login" component={Login} options={{ title: 'Login', animation: 'slide_from_right' }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Signup', animation: 'slide_from_right' }} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="ContactUs" component={ContactUs} />
            <Stack.Screen name="Setting" component={Setting} />
            <Stack.Screen name="AboutUs" component={AboutUs} />
          </Stack.Navigator>
        {/* </NavigationContainer> */}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
