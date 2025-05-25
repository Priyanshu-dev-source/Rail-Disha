import {
  Roboto_100Thin,
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Roboto_100Thin,
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const settingsOptions = [
    {
      id: 'notification',
      title: 'Notification',
      icon: 'bell',
      type: 'switch',
      value: notificationsEnabled,
      onValueChange: () => setNotificationsEnabled(prev => !prev),
    },
    {
      id: 'darkMode',
      title: 'Dark Mode',
      icon: 'sun',
      type: 'switch',
      value: darkModeEnabled,
      onValueChange: () => setDarkModeEnabled(prev => !prev),
    },
    {
      id: 'rateApp',
      title: 'Rate App',
      icon: 'star',
      type: 'link',
    },
    {
      id: 'shareApp',
      title: 'Share App',
      icon: 'share-2',
      type: 'link',
    },
    {
      id: 'privacyPolicy',
      title: 'Privacy Policy',
      icon: 'lock',
      type: 'link',
    },
    {
      id: 'termsConditions',
      title: 'Terms and Conditions',
      icon: 'file-text',
      type: 'link',
    },
    {
      id: 'cookiesPolicy',
      title: 'Cookies Policy',
      icon: 'file',
      type: 'link',
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: 'mail',
      type: 'link',
      onPress: () => navigation.navigate('Contact'),
    },
    {
      id: 'feedback',
      title: 'Feedback',
      icon: 'message-square',
      type: 'link',
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: 'log-out',
      type: 'link',
    },
  ];

  const renderItem = (item) => {
    return (
      <TouchableOpacity 
        key={item.id} 
        style={styles.settingItem}
        onPress={item.onPress}
      >
        <View style={styles.settingItemLeft}>
          <Feather name={item.icon} size={20} color="#1E88E5" style={styles.settingIcon} />
          <Text style={styles.settingTitle}>{item.title}</Text>
        </View>
        {item.type === 'switch' ? (
          <Switch
            trackColor={{ false: "#e0e0e0", true: "#BBD6F9" }}
            thumbColor={item.value ? "#1E88E5" : "#f4f3f4"}
            ios_backgroundColor="#e0e0e0"
            onValueChange={item.onValueChange}
            value={item.value}
          />
        ) : (
          <Feather name="chevron-right" size={20} color="#554AE7" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.settingsList}>
        {settingsOptions.map(item => renderItem(item))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 30,
    // fontWeight: 'bold',
    fontFamily: "Roboto_700Bold",
  },
  settingsList: {
    flex: 1,
    paddingHorizontal: 20,
    gap:15
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    // gap:30
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap:30
  },
  settingIcon: {
    marginRight: 15,
    color: "#554AE7",
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    fontFamily: "Roboto_400Regular",
  },
});