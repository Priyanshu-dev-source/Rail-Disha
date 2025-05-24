import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
    useFonts,
    Roboto_700Bold,
    Roboto_400Regular,
  } from "@expo-google-fonts/roboto";

import Priyanshu from "../assets/images/Priyanshu.jpg"
import Divyansh from "../assets/images/divyansh.jpg"
import Eram from "../assets/images/Eram.jpg"
import DevPrakash from "../assets/images/devDubey.jpg"
import Sachin from "../assets/images/sachin.jpg"
import Dev from "../assets/images/dev.jpg"

export default function AboutUs() {
    const [fontsLoaded] = useFonts({
        Roboto_700Bold,
        Roboto_400Regular,
      });

  const contactInfo = {
    email: 'contact@company.com',
    phone: '+1 (555) 123-4567',
    rights: 'All Rights Reserved',
    location: 'San Francisco, California',
  };

  const teamMembers = [
    {
      id: '1',
      name: 'Priyanshu Ojha',
      role: 'Tech Lead',
      image: Priyanshu,
    },
    {
      id: '2',
      name: 'Divyansh Vijay',
      role: 'Team Leader',
      image: Divyansh,
    },
    {
      id: '3',
      name: 'Eram Fatima',
      role: 'UI/UX Designer',
      image: Eram,
    },
    {
      id: '4',
      name: 'Dev Prakash Dubey',
      role: 'UI/UX Designer',
      image: DevPrakash,
    },
    {
      id: '5',
      name: 'Sachin Yadav',
      role: 'Algorithm Designer',
      image: Sachin,
    },
    {
      id: '6',
      name: 'Dev Aggarwal',
      role: 'Research and IoT',
      image: Dev,
    },
  ];

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${contactInfo.email}`);
  };

  const handlePhonePress = () => {
    Linking.openURL(`tel:${contactInfo.phone}`);
  };

  const handleLocationPress = () => {
    Linking.openURL(`https://maps.google.com/?q=${contactInfo.location}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>About Us</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.contactBox}>
          <Text style={styles.contactBoxTitle}>Contact Information</Text>
          
          <View style={styles.contactItem}>
            <Feather name="mail" size={20} color="#1E88E5" style={styles.contactIcon} />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Email</Text>
              <TouchableOpacity onPress={handleEmailPress}>
                <Text style={styles.contactText}>{contactInfo.email}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <Feather name="phone" size={20} color="#1E88E5" style={styles.contactIcon} />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Phone</Text>
              <TouchableOpacity onPress={handlePhonePress}>
                <Text style={styles.contactText}>{contactInfo.phone}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <Feather name="shield" size={20} color="#1E88E5" style={styles.contactIcon} />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>App Rights</Text>
              <Text style={styles.contactText}>{contactInfo.rights}</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <Feather name="map-pin" size={20} color="#1E88E5" style={styles.contactIcon} />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Location</Text>
              <TouchableOpacity onPress={handleLocationPress}>
                <Text style={styles.contactText}>{contactInfo.location}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.teamTitle}>Team Navigators</Text>
        
        <View style={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <View key={member.id} style={styles.teamMember}>
              <View style={styles.photoContainer}>
                <Image 
                  source={member.image} 
                  style={styles.memberPhoto} 
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Rail Disha. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 35,
    // fontWeight: 'bold',.
    fontFamily:"Roboto_700Bold",
    color: 'black',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  contactBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 30,
    gap: 20
  },
  contactBoxTitle: {
    fontSize: 28,
    // fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#1E88E5',
    fontFamily:"Roboto_700Bold",
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  contactIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
    fontFamily:"Roboto_700Bold",
  },
  contactText: {
    fontSize: 13,
    color: '#333',
    fontFamily:"Roboto_400Regular",
  },
  teamTitle: {
    fontSize: 28,
    // fontWeight: 'bold',
    marginBottom: 20,
    color: '#1E88E5',
    textAlign: 'center',
    fontFamily:"Roboto_700Bold",
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  teamMember: {
    width: '48%',
    marginBottom: 20,
    alignItems: 'center',
  },
  photoContainer: {
    width: 160,
    height: 160,
    borderRadius: "50%",
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
  },
  memberPhoto: {
    width: '100%',
    height: '100%',
  },
  memberName: {
    fontSize: 18,
    // fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
    fontFamily:"Roboto_700Bold",
  },
  memberRole: {
    fontSize: 13,
    color: '#666',
    fontFamily:"Roboto_400Regular",
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    fontFamily:"Roboto_400Regular",
  },
});