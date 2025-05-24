import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular,
  Roboto_100Thin,
} from "@expo-google-fonts/roboto";

const notifications = [
  {
    id: '1',
    icon: '✈️',
    iconBg: '#7B68EE',
    title: 'Reminder: You better be ready!',
    description: 'Flight is tomorrow at 9am',
    time: '24min ago',
  },
  {
    id: '2',
    icon: '🏠',
    iconBg: '#2ECC71',
    title: 'Reminder: You have 1 invitation',
    description: 'Tonight at 17pm',
    time: '2h 17min ago',
  },
  {
    id: '3',
    icon: '🛏️',
    iconBg: '#F39C12',
    title: 'Reminder: There is only 1 day',
    description: 'Left to reserve your hotel room!',
    time: 'Yesterday, 17:35 pm',
  },
  {
    id: '4',
    icon: '🚕',
    iconBg: '#3498DB',
    title: 'Reminder: Your transfer from',
    description: 'The hotel to airport at 5pm',
    time: 'Sunday, 06:15 pm',
  },
  {
    id: '5',
    icon: '🎟️',
    iconBg: '#9DA5B4',
    title: 'Offer: Off-Season will end in',
    description: '20 Oct get it now!',
    time: 'Oct, 18 2018',
  },
  {
    id: '6',
    icon: '✈️',
    iconBg: '#7B68EE',
    title: 'Reminder: You better be ready!',
    description: 'Flight is tomorrow at 9am',
    time: '24min ago',
  },
  {
    id: '7',
    icon: '🏠',
    iconBg: '#2ECC71',
    title: 'Reminder: You have 1 invitation',
    description: 'Tonight at 17pm',
    time: '2h 17min ago',
  },
  {
    id: '8',
    icon: '🛏️',
    iconBg: '#F39C12',
    title: 'Reminder: There is only 1 day',
    description: 'Left to reserve your hotel room!',
    time: 'Yesterday, 17:35 pm',
  },
  {
    id: '9',
    icon: '🚕',
    iconBg: '#3498DB',
    title: 'Reminder: Your transfer from',
    description: 'The hotel to airport at 5pm',
    time: 'Sunday, 06:15 pm',
  },
  {
    id: '10',
    icon: '🎟️',
    iconBg: '#9DA5B4',
    title: 'Offer: Off-Season will end in',
    description: '20 Oct get it now!',
    time: 'Oct, 18 2018',
  },
];

const NotificationItem = ({ item }) => (
  <View style={styles.notificationItem}>
    <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
      <Text style={styles.icon}>{item.icon}</Text>
    </View>
    <View style={styles.notificationContent}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationDescription}>{item.description}</Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
  </View>
);

export default function NotificationsScreen({ navigation }) {

  const [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Roboto_100Thin,
  });


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Feather name="more-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    // fontWeight: 'bold',
    fontFamily:"Roboto_700Bold"
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop:40
  },
  notificationItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 20,
    color: 'white',
  },
  notificationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationTitle: {
    fontSize: 17,
    fontWeight: '500',
    fontFamily:"Roboto_700Bold"
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontFamily:"Roboto_400Regular"
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontFamily:"Roboto_400Regular"
  },
});