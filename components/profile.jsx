"use client";

import {
  Roboto_100Thin,
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Roboto_100Thin,
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('userData');
      // Clear user data from state
      setUserData(null);
      // Show success popup
      Alert.alert(
        "Logout Successful",
        "You have been successfully logged out.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login") // Navigate to Login screen
          }
        ]
      );
      // Trigger haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.avatarPlaceholder}>
            <Image
              source={require("../assets/images/userAvatar.png")}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.userName}>{userData?.name || "Guest User"}</Text>
          <Text style={styles.userEmail}>{userData?.email || "Not logged in"}</Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate("Setting");
            }}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color="#554AE7"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate("Notification");
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#554AE7"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate("ContactUs");
            }}
          >
            <Ionicons
              name="help-circle-outline"
              size={24}
              color="#554AE7"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate("AboutUs");
            }}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#554AE7"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="exit-outline" size={30} color="#554AE7" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingLeft:30,
    alignItems: "start",
    // backgroundColor:"red"
  },
  headerTitle: {
    fontSize: 40,
    // fontWeight: "bold",
    color: "black",
    fontFamily: "Roboto_700Bold",
  },
  profileInfo: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100, // use half of width/height for circle
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#554AE7",
    overflow: "hidden",
    backgroundColor: "#554AE7", // ensures the image doesn't overflow
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 100, // ensures the image is circular
  },
  userName: {
    fontSize: 28,
    // fontWeight: "bold",
    color: "black",
    marginBottom: 5,
    fontFamily: "Roboto_700Bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#8D8D8D",
    fontFamily: "Roboto_700Bold",
  },
  menuSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: "#2A2A40",
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "black",
    fontFamily: "Roboto_400Regular",
  },
  logoutButton: {
    marginTop: 40,
    marginHorizontal: 20,
    // backgroundColor: "#60A5FA",
    // borderRadius: 25,
    padding: 15,
    paddingRight: 25,
    alignItems: "center",
    display:"flex",
    justifyContent:"center",
    flexDirection:"row",
    gap:15
  },
  logoutText: {
    color: "#554AE7",
    // fontWeight: "bold",
    fontSize: 22,
    fontFamily: "Roboto_700Bold",
  },
});
