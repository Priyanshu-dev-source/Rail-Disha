import React, { useRef, useEffect } from "react";
import { GestureHandlerRootView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import SplashScreen from 'react-native-splash-screen'
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Animated, Dimensions, StyleSheet, Text, View, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AboutUs from "../components/aboutUs";
import AccountPage from "../components/accountPage";
import ContactUs from "../components/contactUs";
// import DeadReckoning from "../components/DeadReckoning";
import HomeScreen from "../components/home";
import RewardSection from "../components/rewardSection";
import Login from "../components/login";
import Maps from "../components/maps";
import Notification from "../components/notification";
import ProfileScreen from "../components/profile";
import Setting from "../components/setting";
import SignUp from "../components/signUp";
// import DeadReckoning from "../components/DeadReckoning"

// import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { width } = Dimensions.get("window");
const TAB_WIDTH = (width * 0.93 - 20) / 4; // Adjusted for 4 tabs and padding

function CustomTabBar({ state, descriptors, navigation }) {
  const translateX = useRef(new Animated.Value(0)).current;

  const animateBackground = (index) => {
    Animated.spring(translateX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      friction: 10,
      tension: 50
    }).start();
  };

  return (
    <View style={styles.tabBarContainer}>
      <Animated.View
        style={[
          styles.animatedBackground,
          {
            transform: [{ translateX }],
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            animateBackground(index);
            navigation.navigate(route.name);
          }
        };

        let iconName;
        if (route.name === "Reward") iconName = "cash-outline";
        else if (route.name === "Maps") iconName = "map-outline";
        else if (route.name === "Account") iconName = "finger-print-outline";
        else if (route.name === "Profile") iconName = "person-circle-outline";
        // else if (route.name === "DeadReckoning") iconName = "person-circle-outline";

        return (
          // <TouchableWithoutFeedback
          //   key={route.key}
          //   onPress={onPress}
          //   style={styles.tabButton}
          // >
          //   <View style={[
          //     styles.iconContainer,
          //     isFocused && styles.activeIconContainer
          //   ]}>
          //     <Ionicons
          //       name={iconName}
          //       size={24}
          //       color={isFocused ? "#000000" : "#666"}
          //       style={[
          //         styles.icon,
          //         isFocused && styles.activeIcon
          //       ]}
          //     />
          //   </View>
          // </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
  key={route.key}
  onPress={onPress}
>
  <View style={styles.tabButton}>
    <View style={[
      styles.iconContainer,
      isFocused && styles.activeIconContainer
    ]}>
      <Ionicons
        name={iconName}
        size={isFocused ? 20 : 24}
        color={isFocused ? "#000000" : "#666"}
        style={[
          styles.icon,
          isFocused && styles.activeIcon
        ]}
      />
    </View>
    {isFocused && (
      <Text style={styles.label}>{route.name}</Text>
    )}
  </View>
</TouchableWithoutFeedback>
        );
      })}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Maps" component={Maps} />
      <Tab.Screen name="Reward" component={RewardSection} />
      <Tab.Screen name="Account" component={AccountPage} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {/* <Tab.Screen 
        name="DeadReckoning" 
        component={DeadReckoning}
        initialParams={{ onPositionUpdate: (position) => console.log('Position updated:', position) }}
      /> */}
    </Tab.Navigator>
  );
}

export default function App() {


  useEffect(() => {
    if(Platform.OS === "android"){
      SplashScreen.hide();
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* <NavigationContainer> */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainApp" component={MainTabs} />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: "Login", animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: "Signup", animation: "slide_from_right" }}
          />
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

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap:26,
    alignItems: "center",
    paddingTop: 0,
    bottom: 9,
    marginLeft: 10,
    right: 12,
    width: "95%",
    backgroundColor: "#F5F5F5",
    borderRadius: 35,
    height: 60,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    paddingHorizontal: 10,
    borderTopWidth: 0,
    overflow: 'hidden',
    zIndex: 4,
  },
  iconContainer: {
    display: "flex",
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "space-evenly",
    position: "relative",
    zIndex: 2,
  },
  activeIconContainer: {
    transform: [{scale: 1.1}],
  },
  icon: {
    opacity: 0.8,
    // color: "#FFFFFF",
  },
  activeIcon: {
    opacity: 1,
    color: "#FFFFFF",
    zIndex: 5
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    // alignItems: "center",
    justifyContent: "center",
    // flex: 1,
  },
  animatedBackground: {
    position: "absolute",
    width: TAB_WIDTH,
    height: 50,
    backgroundColor: "#554AE7",
    borderRadius: 30,
    // zIndex: 1,
    left: 10, // Adjust this value to align with the first tab
  },
  label: {
    fontSize: 14,
    color: "white",
    zIndex: 10,
    marginTop: 1,
    bottom:17,
    textAlign: "center",
    fontFamily:"Poppins-Regular",
    letterSpacing:0.5,
    // backgroundColor: "red",
  },
  // tabButton: {
  //   alignItems: "center",
  //   justifyContent: "center",
  //   flex: 1,
  // },
  
});
