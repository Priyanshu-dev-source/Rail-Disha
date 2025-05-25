import {
  Roboto_100Thin,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const BOTTOM_SHEET_MAX_HEIGHT = 350;
const BOTTOM_SHEET_MIN_HEIGHT = 218;
const SNAP_POINTS = {
  BOTTOM: BOTTOM_SHEET_MIN_HEIGHT,
  TOP: BOTTOM_SHEET_MAX_HEIGHT
};
const LABEL_TOP_SPACING = -25;
const SPRING_CONFIG = {
  tension: 50,
  friction: 9,
  useNativeDriver: true,
};
const TIMING_CONFIG = {
  duration: 250,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
  useNativeDriver: true,
};

// Mock data for search suggestions - replace with your actual data source
const mockPlaces = [
  { id: '1', name: 'Zara Fashion Store', distance: '5 min (200m)', icon: '🏬' },
  { id: '2', name: 'Food Court', distance: '8 min (350m)', icon: '🍽️' },
  { id: '3', name: 'Central Library', distance: '12 min (500m)', icon: '📚' },
  { id: '4', name: 'Sports Complex', distance: '15 min (700m)', icon: '🏃' },
  { id: '5', name: 'Coffee Shop', distance: '3 min (150m)', icon: '☕' },
];

export default function MapScreen() {
  const [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  const translateY = useSharedValue(0);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(BOTTOM_SHEET_MAX_HEIGHT);
  const webViewRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0, heading: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchBoxExpanded, setIsSearchBoxExpanded] = useState(false);
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Animation values
  const searchBoxHeight = useRef(new Animated.Value(0)).current;
  const searchBoxOpacity = useRef(new Animated.Value(0)).current;
  const startInputPosition = useRef(new Animated.Value(0)).current;
  const destInputPosition = useRef(new Animated.Value(0)).current;
  const startLabelPosition = useRef(new Animated.Value(0)).current;
  const destLabelPosition = useRef(new Animated.Value(0)).current;
  const startScale = useRef(new Animated.Value(1)).current;
  const destScale = useRef(new Animated.Value(1)).current;
  const [isStartFocused, setIsStartFocused] = useState(false);
  const [isDestFocused, setIsDestFocused] = useState(false);
  const swapButtonRotation = useRef(new Animated.Value(0)).current;
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showBottomBox, setShowBottomBox] = useState(false);

  const handlePositionUpdate = (position) => {
    setCurrentPosition(position);
    
    // Send position update to the web view map
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        window.updateUserPosition && window.updateUserPosition(${position.x}, ${position.y}, ${position.heading});
        true;
      `);
    }
  };

  const handleSearch = (query) => {
    if (query.length > 0) {
      const filtered = mockPlaces.filter(place =>
        place.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(true);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handlePlaceSelection = (place) => {
    setSelectedPlace(place);
    setSearchResults([]);
    setIsSearching(false);
    setShowBottomBox(true);
    setDestination(place.name);
  };

  const handleStartNavigation = () => {
    setShowBottomBox(false);
    setIsSearchBoxExpanded(true);
    handleSearchPress();
  };

  const handleVoiceInput = () => {
    // Implement voice input functionality here
    console.log('Voice input activated');
  };

  const handleSearchPress = () => {
    setIsSearchBoxExpanded(true);
    Animated.parallel([
      Animated.timing(searchBoxHeight, {
        toValue: 350,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(searchBoxOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animateLabel = (position, scale, toValue) => {
    Animated.parallel([
      Animated.spring(position, {
        ...SPRING_CONFIG,
        toValue,
      }),
      Animated.timing(scale, {
        ...TIMING_CONFIG,
        toValue: toValue === 1 ? 0.75 : 1,
      }),
    ]).start();
  };

  const handleInputFocus = (inputType) => {
    if (inputType === 'start') {
      setIsStartFocused(true);
      animateLabel(startLabelPosition, startScale, 1);
    } else {
      setIsDestFocused(true);
      animateLabel(destLabelPosition, destScale, 1);
    }
  };

  const handleInputBlur = (inputType) => {
    const value = inputType === 'start' ? startLocation : destination;
    if (inputType === 'start') {
      setIsStartFocused(false);
      if (!value) animateLabel(startLabelPosition, startScale, 0);
    } else {
      setIsDestFocused(false);
      if (!value) animateLabel(destLabelPosition, destScale, 0);
    }
  };

  const handleBackdropPress = () => {
    if (isSearchBoxExpanded) {
      Animated.parallel([
        Animated.timing(searchBoxHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(searchBoxOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setIsSearchBoxExpanded(false);
      });
    }
  };

  const handleSwapLocations = () => {
    // Swap the values
    const tempLocation = startLocation;
    setStartLocation(destination);
    setDestination(tempLocation);
    
    // Animate the swap button
    Animated.sequence([
      Animated.timing(swapButtonRotation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      swapButtonRotation.setValue(0); // Reset for next animation
    });
  };

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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const renderSearchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handlePlaceSelection(item)}
    >
      <Text style={styles.placeIcon}>{item.icon}</Text>
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{item.name}</Text>
        <Text style={styles.placeDistance}>{item.distance}</Text>
      </View>
      <Feather name="arrow-right" size={20} color="#666" />
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#554AE7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <WebView 
          ref={webViewRef}
          source={{ uri: 'https://raildisha-map.vercel.app/' }} 
          style={{ flex: 1 }}
        />
      </TouchableWithoutFeedback>

      {/* Floating Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Where do you want to go?"
            onChangeText={handleSearch}
            onFocus={() => setIsSearching(true)}
          />
          <TouchableOpacity style={styles.micButton} onPress={handleVoiceInput}>
            <Feather name="mic" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Search Results */}
        {isSearching && searchResults.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <FlatList
              data={searchResults}
              renderItem={renderSearchItem}
              keyExtractor={item => item.id}
              style={styles.searchResultsList}
            />
          </View>
        )}
      </View>

      {/* Bottom Destination Box */}
      {showBottomBox && selectedPlace && (
        <View style={styles.bottomBox}>
          <View style={styles.destinationInfo}>
            <View style={styles.destinationHeader}>
              <Text style={styles.destinationName}>{selectedPlace.name}</Text>
              <Text style={styles.destinationDistance}>{selectedPlace.distance}</Text>
            </View>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={handleStartNavigation}
            >
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Expanded Search Box */}
      {isSearchBoxExpanded && (
        <Animated.View 
          style={[
            styles.expandedSearchBox,
            {
              height: searchBoxHeight,
              width:"95%",
              opacity: searchBoxOpacity,
            },
          ]}
        >
          <View style={styles.expandedHeader}>
            <View style={styles.avatarContainer}>
              <Image 
                source={require('../assets/images/railLogo.png')} 
                style={styles.avatar}
              />
              <View>
                <Text style={styles.headerTitle}>Hey RailDisha<Text> 😊</Text></Text>
                <Text style={styles.whereText}>Where are you going today?</Text>
              </View>
              {/* <TouchableOpacity style={styles.cameraButton}>
                <Feather name="camera" size={24} color="#000" />
              </TouchableOpacity> */}
            </View>
          </View>

          <View style={styles.inputsContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputInnerWrapper}>
                <Animated.Text
                  style={[
                    styles.inputLabel,
                    {
                      transform: [
                        {
                          translateY: startLabelPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, LABEL_TOP_SPACING],
                          }),
                        },
                        {
                          scale: startScale.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.75],
                          }),
                        },
                      ],
                      color: startLabelPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['#666', '#8B5CF6'],
                      }),
                    },
                  ]}
                >
                  Starting location
                </Animated.Text>
                <TextInput
                  style={[
                    styles.locationInput,
                    isStartFocused && styles.locationInputFocused,
                  ]}
                  value={startLocation}
                  onChangeText={setStartLocation}
                  onFocus={() => handleInputFocus('start')}
                  onBlur={() => handleInputBlur('start')}
                />
              </View>
              <TouchableOpacity style={styles.linkButton} onPress={() => setStartLocation('')}>
                <Feather name="x" size={20} color="#8B5CF6" />
              </TouchableOpacity>
            </View>

            <View style={styles.swapButtonContainer}>
              <TouchableOpacity 
                style={styles.swapButton}
                onPress={handleSwapLocations}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={{
                    transform: [{
                      rotate: swapButtonRotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg']
                      })
                    }]
                  }}
                >
                  <MaterialIcons name="swap-vert" size={24} color="white" />
                </Animated.View>
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputInnerWrapper}>
                <Animated.Text
                  style={[
                    styles.inputLabel,
                    {
                      transform: [
                        {
                          translateY: destLabelPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, LABEL_TOP_SPACING],
                          }),
                        },
                        {
                          scale: destScale.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.75],
                          }),
                        },
                      ],
                      color: destLabelPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['#666', '#8B5CF6'],
                      }),
                    },
                  ]}
                >
                  Destination location
                </Animated.Text>
                <TextInput
                  style={[
                    styles.locationInput,
                    isDestFocused && styles.locationInputFocused,
                  ]}
                  value={destination}
                  onChangeText={setDestination}
                  onFocus={() => handleInputFocus('dest')}
                  onBlur={() => handleInputBlur('dest')}
                />
              </View>
              <TouchableOpacity style={styles.linkButton} onPress={() => setDestination('')}>
                <Feather name="x" size={20} color="#8B5CF6" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.getRouteButton}>
              <Text style={styles.getRouteText}>Get The Route</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      
      {/* Dead Reckoning Component */}
      {/* { <View style={styles.deadReckoningContainer}>
        <DeadReckoning onPositionUpdate={handlePositionUpdate} />
      </View> } */}
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Roboto_400Regular',
  },
  micButton: {
    padding: 8,
    backgroundColor: "#554AE7",
    borderRadius: 50,
  },
  deadReckoningContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
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
  expandedSearchBox: {
    position: 'absolute',
    // height:,
    top: 10,
    left: 9,
    // right: 20,
    backgroundColor: 'white',
    zIndex: 3,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
  },
  expandedHeader: {
    marginBottom: 20,
    paddingBottom: 10,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    gap:5
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 12,
    backgroundColor: "#554AE7E5"

  },
  headerTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    color: '#554AE7E5',
    marginBottom: 4,
    fontFamily: 'Roboto_700Bold',
  },
  whereText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Roboto_400Regular',
  },
  cameraButton: {
    padding: 8,
  },
  inputsContainer: {
    gap: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 8,
    // backgroundColor: '#e4e4e7',
    borderRadius: 10,
  },
  inputInnerWrapper: {
    flex: 1,
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
  inputLabel: {
    position: 'absolute',
    left: -8,
    color: '#666',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
  locationInput: {
    fontSize: 16,
    color: '#8B5CF6',
    paddingVertical: 8,
    fontFamily: 'Roboto_400Regular',
  },
  locationInputFocused: {
    color: '#8B5CF6',
  },
  linkButton: {
    padding: 8,
  },
  swapButtonContainer: {
    alignItems: 'center',
    marginVertical: -5,
    zIndex: 1,
    
  },
  swapButton: {
    backgroundColor: "#554AE7E5",
    // backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  getRouteButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  getRouteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto_500Medium',
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchResultsList: {
    padding: 10,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  placeIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    color: '#333',
  },
  placeDistance: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: '#666',
    marginTop: 2,
  },
  bottomBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  destinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  destinationHeader: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    color: '#333',
    marginBottom: 4,
  },
  destinationDistance: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: '#666',
  },
  startButton: {
    backgroundColor: '#554AE7',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 15,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});