import { View, Text, Image, StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native"
// import { Asset } from 'expo-asset';
import {
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular,
} from "@expo-google-fonts/roboto";

// Preload the image
// const logoImage = require("../assets/images/logo.png");

export default function HomePage() {
   const [fontsLoaded] = useFonts({
      Roboto_700Bold,
      Roboto_400Regular,
    });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Home text in top left */}
      {/* <View style={styles.header}>
        <Text style={styles.homeText}>Home</Text>
      </View> */}

      {/* Main content with Rail Disha text and logo */}
      <View style={styles.content}>
        <Text style={styles.titleText}>Rail Disha</Text>
        {/* <Image 
          source={logoImage} 
          style={styles.logo} 
          resizeMode="contain"
        /> */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
    alignItems: "flex-start",
    // borderBottomWidth: 1,
    // borderBottomColor: "#e0e0e0",
    paddingBottom:20
  },
  homeText: {
    fontSize: 20,
    // fontWeight: "500",
    color: "#333",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 52,
    width:300,
    // fontWeight: "bold",
    fontFamily:"Roboto_700Bold",
    marginBottom: 24,
    color: "#2c3e50",
    textAlign:"center"
  },
  logo: {
    width: 150,
    height: 150,
  },
})
