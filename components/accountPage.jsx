"use client"

import { Roboto_100Thin, Roboto_400Regular, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { StatusBar } from "expo-status-bar";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Account() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Roboto_100Thin,
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <TouchableOpacity style={styles.backButton} onPress={() => {
        Haptics.selectionAsync();
        navigation.goBack();
      }}>
        <Ionicons name="arrow-back" size={30} color="black" />
        <Text style={styles.pageName}>Account</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/authImage.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate('Login');
            }}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate('SignUp');
            }}
            >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guestButton}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainApp' }],
              });
            }}
          >
            <Text style={styles.guestButtonText}>Continue as a guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "start",
  },
  backButton: {
    paddingTop: 20,
    paddingBottom: 0,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageName: {
    fontSize: 22,
    fontFamily: "Roboto_700Bold",
    marginLeft: 10,
    width:300,
    color: "#1A1A2E",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    width: 400,
    height: 400,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#60A5FA",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Roboto_700Bold",
  },
  registerButton: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingBottom: 5,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    height: 55,
    borderColor: "#60A5FA",
    justifyContent: "center",
  },
  registerButtonText: {
    color: "#60A5FA",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Roboto_400Regular",
  },
  guestButton: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingBottom: 5,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    height: 55,
    borderColor: "#60A5FA",
    justifyContent: "center",
  },
  guestButtonText: {
    color: "#60A5FA",
    fontSize: 18,
    width: 300,
    textAlign: "center",
    fontFamily: "Roboto_400Regular",
  },
});
