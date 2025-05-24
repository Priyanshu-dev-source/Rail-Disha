// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Animated,
//   Dimensions,
//   TouchableWithoutFeedback,
//   Platform,
//   StatusBar,
//   Image
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { WebView } from 'react-native-webview';

// const { width, height } = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const PLACES = [
//   {
//     id: '1',
//     name: 'Golden Gate Park',
//     address: 'San Francisco, CA 94121',
//     rating: 4.8,
//     reviews: 12453,
//     description: 'Golden Gate Park, located in San Francisco, California, is a large urban park consisting of 1,017 acres of public grounds. It is rectangular in shape, similar to Central Park in New York City, but 20% larger.',
//     image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//     latitude: 37.7694,
//     longitude: -122.4862,
//     hours: 'Open 24 hours',
//     phone: '+1 (415) 831-2700',
//     website: 'goldengatepark.com',
//     amenities: ['Parking', 'Restrooms', 'Picnic areas', 'Playgrounds', 'Museums', 'Gardens'],
//   },
//   {
//     id: '2',
//     name: 'Fisherman\'s Wharf',
//     address: 'Beach Street & The Embarcadero',
//     rating: 4.5,
//     reviews: 9876,
//     description: 'Fisherman\'s Wharf is a neighborhood and popular tourist attraction in San Francisco, California. It roughly encompasses the northern waterfront area of San Francisco from Ghirardelli Square or Van Ness Avenue east to Pier 35 or Kearny Street.',
//     image: 'https://images.unsplash.com/photo-1541464522988-31b420f688b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//     latitude: 37.8080,
//     longitude: -122.4177,
//     hours: 'Open 24 hours (individual businesses vary)',
//     phone: '+1 (415) 673-3530',
//     website: 'fishermanswharf.org',
//     amenities: ['Restaurants', 'Shopping', 'Sea lion viewing', 'Street performers', 'Boat tours'],
//   },
//   {
//     id: '3',
//     name: 'Alcatraz Island',
//     address: 'San Francisco, CA 94133',
//     rating: 4.7,
//     reviews: 8765,
//     description: 'Alcatraz Island is located in San Francisco Bay, 1.25 miles offshore from San Francisco. The small island was developed with facilities for a lighthouse, a military fortification, a military prison, and a federal prison from 1934 until 1963.',
//     image: 'https://images.unsplash.com/photo-1541943894732-5b08c8dfa08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//     latitude: 37.8270,
//     longitude: -122.4230,
//     hours: '8:45 AM - 6:15 PM',
//     phone: '+1 (415) 561-4900',
//     website: 'nps.gov/alca',
//     amenities: ['Guided tours', 'Museum', 'Gift shop', 'Ferry service', 'Audio tours'],
//   }
// ];

// export default function MapScreen() {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedPlace, setSelectedPlace] = useState(null);
//   const [detailsExpanded, setDetailsExpanded] = useState(false);
//   const detailsHeight = useRef(new Animated.Value(120)).current;
//   const mapRef = useRef(null);
  
//   const toggleDetailsExpansion = () => {
//     if (detailsExpanded) {
//       // Collapse
//       Animated.timing(detailsHeight, {
//         toValue: 120,
//         duration: 300,
//         useNativeDriver: false,
//       }).start();
//     } else {
//       // Expand
//       Animated.timing(detailsHeight, {
//         toValue: height * 0.6,
//         duration: 300,
//         useNativeDriver: false,
//       }).start();
//     }
//     setDetailsExpanded(!detailsExpanded);
//   };

//   // Collapse details when tapping on the map
//   const handleMapPress = () => {
//     if (detailsExpanded) {
//       toggleDetailsExpansion();
//     }
//   };

//   // Render stars based on rating
//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const halfStar = rating % 1 >= 0.5;
    
//     for (let i = 0; i < 5; i++) {
//       if (i < fullStars) {
//         stars.push(<Feather key={i} name="star" size={16} color="#FFD700" />);
//       } else if (i === fullStars && halfStar) {
//         stars.push(<Feather key={i} name="star" size={16} color="#FFD700" style={{ opacity: 0.5 }} />);
//       } else {
//         stars.push(<Feather key={i} name="star" size={16} color="#CCCCCC" />);
//       }
//     }
    
//     return (
//       <View style={{ flexDirection: 'row', marginRight: 5 }}>
//         {stars}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" />
      
//       {/* Map */}
//       <TouchableWithoutFeedback onPress={handleMapPress}>
//       <WebView 
//           source={{ uri: 'https://raildisha-map.vercel.app/' }} 
//           style={{ flex: 1 }}
//         />
//       </TouchableWithoutFeedback>
      
//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <View style={styles.searchBar}>
//           <TouchableOpacity style={styles.menuButton}>
//             <Feather name="menu" size={22} color="#333" />
//           </TouchableOpacity>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search here"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholderTextColor="#888"
//           />
//           <TouchableOpacity style={styles.searchButton}>
//             <Feather name="search" size={22} color="#1E88E5" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   searchContainer: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 50 : 30,
//     left: 0,
//     right: 0,
//     paddingHorizontal: 16,
//     zIndex: 5,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     borderRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   menuButton: {
//     padding: 5,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     paddingHorizontal: 10,
//     fontSize: 16,
//     color: '#333',
//   },
//   searchButton: {
//     padding: 5,
//   },
//   detailsContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 10,
//     zIndex: 10,
//   },
//   detailsHandle: {
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   handleBar: {
//     width: 40,
//     height: 5,
//     backgroundColor: '#DDD',
//     borderRadius: 3,
//   },
//   detailsScroll: {
//     flex: 1,
//   },
//   detailsHeader: {
//     paddingHorizontal: 20,
//     paddingBottom: 15,
//   },
//   placeName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   placeAddress: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 8,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   ratingText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   quickActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   quickActionButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 10,
//   },
//   quickActionText: {
//     marginTop: 5,
//     fontSize: 12,
//     color: '#1E88E5',
//   },
//   expandedDetails: {
//     paddingHorizontal: 20,
//     paddingBottom: 30,
//   },
//   placeImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 8,
//     marginVertical: 15,
//   },
//   detailsSection: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   descriptionText: {
//     fontSize: 14,
//     lineHeight: 22,
//     color: '#555',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   infoIcon: {
//     marginRight: 10,
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#555',
//   },
//   amenitiesContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   amenityTag: {
//     backgroundColor: '#f0f0f0',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginRight: 8,
//     marginBottom: 8,
//   },
//   amenityText: {
//     fontSize: 12,
//     color: '#555',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   actionButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 15,
//   },
//   actionButtonText: {
//     marginTop: 5,
//     fontSize: 12,
//     color: '#1E88E5',
//   },
//   myLocationButton: {
//     position: 'absolute',
//     right: 16,
//     bottom: 140,
//     backgroundColor: 'white',
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     zIndex: 5,
//   },
// });


import React, { useRef, useState } from 'react';
// import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  // Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
  Image
} from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const BOTTOM_SHEET_MAX_HEIGHT = 350;
const BOTTOM_SHEET_MIN_HEIGHT = 218;
const SNAP_POINTS = {
  BOTTOM: BOTTOM_SHEET_MIN_HEIGHT,
  TOP: BOTTOM_SHEET_MAX_HEIGHT
};

export default function MapScreen() {
  const translateY = useSharedValue(0);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(BOTTOM_SHEET_MAX_HEIGHT);
  // const mapRef = useRef(null);
  
  // const origin = { latitude: 26.5123, longitude: 80.2329 }; // Example coordinates
  // const destination = { latitude: 26.4945, longitude: 80.2508 }; // PSIT, Kanpur (example)

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      if (event.velocityY > 500) {
        translateY.value = withSpring(BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT, { damping: 15 });
        runOnJS(setBottomSheetHeight)(BOTTOM_SHEET_MIN_HEIGHT);
      } else if (event.velocityY < -500) {
        translateY.value = withSpring(0, { damping: 15 });
        runOnJS(setBottomSheetHeight)(BOTTOM_SHEET_MAX_HEIGHT);
      } else {
        if (translateY.value > (BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT) / 2) {
          translateY.value = withSpring(BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT, { damping: 15 });
          runOnJS(setBottomSheetHeight)(BOTTOM_SHEET_MIN_HEIGHT);
        } else {
          translateY.value = withSpring(0, { damping: 15 });
          runOnJS(setBottomSheetHeight)(BOTTOM_SHEET_MAX_HEIGHT);
        }
      }
    },
  });

  // const handleMapPress = () => {
  //       if (detailsExpanded) {
  //         toggleDetailsExpansion();
  //       }
  //     };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback>
       <WebView 
          source={{ uri: 'https://raildisha-map.vercel.app/' }} 
          style={{ flex: 1 }}
        />
      </TouchableWithoutFeedback>
      
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.bottomSheet, animatedStyle, { height: bottomSheetHeight }]}>
          <View style={styles.handle} />
          
          <View style={styles.tripInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>4:30</Text>
              <Text style={styles.infoLabel}>Arrival</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>10:24</Text>
              <Text style={styles.infoLabel}>On the way</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>2.2km</Text>
              <Text style={styles.infoLabel}>Distance</Text>
            </View>
          </View>
          
          <View style={styles.routeContainer}>
            <View style={styles.routeInfo}>
              <View style={styles.routeIcons}>
                <View style={styles.originDot} />
                <View style={styles.routeLine} />
                <View style={styles.destinationDot} />
              </View>
              <View style={styles.routeTexts}>
                <View style={styles.locationBox}>
                  <Text style={styles.locationText}>Your Location</Text>
                </View>
                <View style={styles.directionIcon}>
                  <Feather name="arrow-up-down" size={24} color="black" />
                </View>
                <View style={styles.locationBox}>
                  <Text style={styles.locationText}>PSIT, Kanpur</Text>
                </View>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.goButton}>
            <Text style={styles.goButtonText}>Go Now</Text>
            <Feather name="chevron-right" size={20} color="black" style={styles.goButtonIcon} />
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  // bottomSheet: {
  //   position: 'absolute',
  //   bottom: 0,
  //   width: '100%',
  //   backgroundColor: 'rgba(255, 255, 255, 0.3)',
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  //   padding: 20,
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: -2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  // },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // fallback translucent
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden', // for rounded corners on blur
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#DDDDDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  tripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  routeContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  routeInfo: {
    flexDirection: 'row',
  },
  routeIcons: {
    width: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'black',
    borderWidth: 3,
    borderColor: 'white',
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: 'black',
    marginVertical: 5,
  },
  destinationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black',
  },
  routeTexts: {
    flex: 1,
  },
  locationBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  locationText: {
    fontSize: 14,
  },
  directionIcon: {
    alignItems: 'center',
    marginVertical: 2,
  },
  goButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  goButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goButtonIcon: {
    marginLeft: 10,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.25)',
    width: '90%',
    maxHeight: '80%',
  },
});