"use client";

import {
  Roboto_100Thin,
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import axios from 'axios';
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { Path, Svg } from "react-native-svg";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Roboto_100Thin,
  });

  const API = "http://192.168.180.191:5000"  // This is the Android emulator's special IP for localhost

  const loginUser = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Check network connectivity first
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        alert("No internet connection. Please check your network and try again.");
        return;
      }

      setLoading(true);
      const response = await axios.post(`${API}/api/auth/login`, { 
        email, 
        password 
      }, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Login response:', response.data);
      
      if (response.data) {
        // Store user data
        await AsyncStorage.setItem('userData', JSON.stringify({
          name: response.data.user.name,
          email: response.data.user.email,
          token: response.data.token
        }));

        setSuccessModalVisible(true);
        
        setTimeout(() => {
          setSuccessModalVisible(false);
          navigation.navigate('MainApp'); // Navigate to main app after successful login
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'ECONNABORTED') {
        alert("Request timed out. Please check your connection and try again.");
      } else if (error.response) {
        // Server responded with error
        if (error.response.status === 400) {
          alert(error.response.data.error || "Invalid credentials");
        } else if (error.response.status === 401) {
          alert("Invalid email or password");
        } else {
          alert(error.response.data.error || "Login failed. Please try again.");
        }
      } else if (error.request) {
        // No response received
        alert("Cannot connect to the server. Please check if the server is running and try again.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#60A5FA" />
        </View>
      )}

      <Modal isVisible={successModalVisible}>
        <View style={styles.modalContainer}>
          <AntDesign name="checkcircle" size={80} color="green" />
          <Text style={{ fontSize: 18, marginTop: 10 }}>
            Successfully Logged In!
          </Text>
        </View>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.titledescp}>Glad to see you, Again!</Text>
        </View>

        <View style={styles.mainContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#000"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#000"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={loginUser}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>Or Login with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>
                <Ionicons
                  name="logo-facebook"
                  size={30}
                  color="blue"
                ></Ionicons>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>
                <Svg width={25} height={25} viewBox="0 0 326667 333333">
                  <Path
                    d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593z"
                    fill="#4285f4"
                  />
                  <Path
                    d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z"
                    fill="#34a853"
                  />
                  <Path
                    d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851z"
                    fill="#fbbc04"
                  />
                  <Path
                    d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260z"
                    fill="#ea4335"
                  />
                </Svg>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>
                <Ionicons name="logo-apple" size={28} color="#000" />
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.footerLink}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mainContainer: {
    height: 550,
    width: "full",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    // backgroundColor:"red"
  },
  title: {
    fontSize: 45,
    // fontWeight: "bold",
    marginTop: 50,
    color: "#1E232C",
    textAlign: "center",
    fontFamily: "Roboto_700Bold",
  },
  titledescp: {
    fontSize: 20,
    // fontWeight: "bold",
    marginBottom: 30,
    color: "#1E232C",
    textAlign: "center",
    fontFamily: "Roboto_400Regular",
  },
  inputContainer: {
    marginBottom: 15,
    // backgroundColor:"red",
    position: "relative",
    width: 350,
  },
  input: {
    backgroundColor: "#F7F8F9",
    borderRadius: 8,
    padding: 15,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E8ECF4",
    fontFamily: "Roboto_400Regular",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: "#6A707C",
    fontSize: 12,
    paddingRight: 25,
    fontFamily: "Roboto_700Bold",
  },
  loginButton: {
    backgroundColor: "#60A5FA",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
    width: 350,
  },
  loginButtonText: {
    color: "white",
    fontSize: 20,
    letterSpacing: 1,
    // fontWeight: "bold",
    fontFamily: "Roboto_700Bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginTop: 50,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "gray",
  },
  orText: {
    marginHorizontal: 10,
    color: "#60A5FA",
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    // marginTop:40
  },
  socialButton: {
    width: 90,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#60A5FA",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  socialIcon: {
    fontSize: 24,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 50,
  },
  footerText: {
    color: "#6A707C",
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
  },
  footerLink: {
    color: "#60A5FA",
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
    // fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
