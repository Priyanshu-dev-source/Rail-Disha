import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WifiManager from 'react-native-wifi-reborn';

const SCAN_INTERVAL = 30000; // 30 seconds

// Predefined beacons
const BEACONS = [
  { SSID: 'DDDEPS1', latitude: 28.6139, longitude: 77.2090 },
  { SSID: 'DDDEPS2', latitude: 19.0760, longitude: 72.8777 },
  { SSID: "DDDEPS3", latitude: 13.0827, longitude: 80.2707 }
];

const WifiTest = () => {
  const [wifiNetworks, setWifiNetworks] = useState([]);
  const [connectedSSID, setConnectedSSID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastScanTime, setLastScanTime] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [beaconsInRange, setBeaconsInRange] = useState([]);
  const [beaconDet, setBeaconDet ] = useState(true)
  const hasShownBeaconAlert = useRef(false);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'This app needs to access your location to scan WiFi networks',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCurrentWifi = async () => {
    try {
      const ssid = await WifiManager.getCurrentWifiSSID();
      setConnectedSSID(ssid);
      return ssid;
    } catch (error) {
      // console.error("Error getting current WiFi:", error);
      return null;
    }
  };

  const scanWifiNetworks = async (force = false) => {
    if (Platform.OS === 'android') {
      try {
        const currentTime = Date.now();
        if (!force && currentTime - lastScanTime < SCAN_INTERVAL) {
          setError(`Please wait ${Math.ceil((SCAN_INTERVAL - (currentTime - lastScanTime)) / 1000)} seconds before scanning again`);
          return;
        }

        setScanning(true);
        setError(null);

        const currentSSID = await getCurrentWifi();

        const networks = await Promise.race([
          WifiManager.loadWifiList(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Scan timeout')), 10000))
        ]);

        const formattedList = Array.isArray(networks)
          ? networks.map(network => ({
              SSID: network.SSID || "<Hidden SSID>",
              RSSI: network.level,
              frequency: network.frequency,
              capabilities: network.capabilities,
              timestamp: Date.now(),
              isConnected: network.SSID === currentSSID
            }))
          : [];

        setWifiNetworks(formattedList);
        setLastScanTime(currentTime);

        // Detect which known beacons are in range
        const detectedBeacons = BEACONS.map(beacon => {
          const matchingNetwork = formattedList.find(net => net.SSID === beacon.SSID);
          return matchingNetwork ? {
            ...beacon,
            RSSI: matchingNetwork.RSSI,
            signalQuality: getSignalQuality(matchingNetwork.RSSI)
          } : null;
        }).filter(Boolean);
        setBeaconsInRange(detectedBeacons);

        // Notify if all 3 are in range - only once
        if (detectedBeacons.length === BEACONS.length && !hasShownBeaconAlert.current) {
          Alert.alert("Beacon Range", "You are in range of all 3 beacons and connected!");
          hasShownBeaconAlert.current = true;
        }

      } catch (error) {
        console.error("Scan error:", error);
        setError(`Scan failed: ${error.message}`);
        setWifiNetworks([]);
      } finally {
        setScanning(false);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setError("Location permission denied");
        setLoading(false);
        return;
      }
      await scanWifiNetworks(true);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      scanWifiNetworks(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSignalStrengthIcon = (rssi) => {
    if (rssi >= -50) return "wifi";
    if (rssi >= -70) return "wifi-outline";
    if (rssi >= -80) return "wifi-weak";
    return "wifi-off";
  };

  const getSignalQuality = (rssi) => {
    const quality = Math.min(Math.max(2 * (rssi + 100), 0), 100);
    if (quality >= 70) return "Excellent";
    if (quality >= 50) return "Good";
    if (quality >= 30) return "Fair";
    return "Poor";
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#60A5FA" />
          <Text style={styles.loadingText}>Initializing WiFi Scanner...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>WiFi Networks</Text>
        <TouchableOpacity
          style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
          onPress={() => scanWifiNetworks()}
          disabled={scanning}
        >
          <Ionicons name="refresh" size={24} color={scanning ? "#666" : "#60A5FA"} />
          <Text style={[styles.scanButtonText, scanning && styles.scanButtonTextDisabled]}>
            {scanning ? "Scanning..." : "Scan Now"}
          </Text>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <ScrollView style={styles.scrollView}>
        {wifiNetworks.map((network, index) => (
          <View key={`${network.SSID}-${index}`} style={styles.networkItem}>
            <View style={styles.networkHeader}>
              <Ionicons
                name={getSignalStrengthIcon(network.RSSI)}
                size={24}
                color={network.isConnected ? "#60A5FA" : "#666"}
              />
              <Text style={[styles.ssidText, network.isConnected && styles.connectedText]}>
                {network.SSID}
              </Text>
              <Text style={styles.timestampText}>{getTimeAgo(network.timestamp)}</Text>
            </View>
            <View style={styles.networkDetails}>
              <Text style={styles.rssiText}>
                Signal Strength: {network.RSSI} dBm ({getSignalQuality(network.RSSI)})
              </Text>
              <Text style={styles.frequencyText}>
                Frequency: {(network.frequency / 1000).toFixed(1)} GHz
              </Text>
              {network.isConnected && (
                <Text style={styles.connectedStatus}>Connected</Text>
              )}
            </View>
          </View>
        ))}

        <View style={styles.beaconSection}>
          <Text style={styles.headerTitle}>Detected Beacons</Text>
          {beaconsInRange.map((beacon, index) => (
            <View key={index} style={styles.beaconCard}>
              <Ionicons name="location" size={20} color="#60A5FA" />
              <View style={styles.beaconInfo}>
                <Text style={styles.beaconText}>
                  {beacon.SSID} — Lat: {beacon.latitude}, Lon: {beacon.longitude}
                </Text>
                <Text style={styles.beaconSignal}>
                  Distance: {(-40-beacon.RSSI)/(10*2.500000)}m   Decibels: {beacon.RSSI} dBm 
                  ({beacon.signalQuality})
                </Text>
              </View>
              {/* <Text>Actual position by Wifi triangulation:  X:{((-40-beacon.RSSI)/(10*2.500000))**2}</Text> */}
            </View>
          ))}
          
        </View>

        {wifiNetworks.length === 0 && !error && (
          <View style={styles.emptyContainer}>
            <Ionicons name="wifi-off" size={48} color="#666" />
            <Text style={styles.emptyText}>No WiFi networks found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingBottom:100 },
  header: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1A1A2E' },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  scanButtonDisabled: { backgroundColor: '#DDD' },
  scanButtonText: { marginLeft: 10, fontSize: 16, color: '#60A5FA', fontWeight: '600' },
  scanButtonTextDisabled: { color: '#999' },
  errorText: { color: 'red', fontWeight: 'bold', marginTop: 5 },
  scrollView: { paddingHorizontal: 20 },
  networkItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  networkHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ssidText: { fontSize: 20, fontWeight: '600', marginLeft: 10, flex: 1, color: '#222' },
  connectedText: { color: '#60A5FA' },
  timestampText: { fontSize: 12, color: '#888' },
  networkDetails: { marginLeft: 34 },
  rssiText: { fontSize: 14, color: '#555' },
  frequencyText: { fontSize: 14, color: '#555' },
  connectedStatus: { marginTop: 5, fontSize: 14, color: '#60A5FA', fontWeight: '600' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { marginTop: 10, fontSize: 18, color: '#888' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 15, fontSize: 16, color: '#60A5FA', fontWeight: '600' },
  beaconSection: { marginTop: 30 },
  beaconCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  beaconInfo: {
    flex: 1,
    marginLeft: 10,
  },
  beaconText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  beaconSignal: {
    fontSize: 14,
    color: '#666',
  },
});

export default WifiTest;
