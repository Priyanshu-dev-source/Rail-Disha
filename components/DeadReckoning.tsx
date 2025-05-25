import AsyncStorage from '@react-native-async-storage/async-storage';
import { Accelerometer, Gyroscope, Magnetometer, Pedometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Position {
  x: number;
  y: number;
  heading: number;
  accuracy: number;
}

interface SensorData {
  x: number;
  y: number;
  z: number;
  timestamp?: number;
}

interface KalmanFilter {
  x: number;
  P: number;
  Q: number;
  R: number;
}

const DeadReckoning = ({ route }: { route: any }) => {
  const { onPositionUpdate } = route.params || {};
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, heading: 0, accuracy: 0 });
  const [isTracking, setIsTracking] = useState(false);
  const [sensorAvailability, setSensorAvailability] = useState({
    accelerometer: false,
    gyroscope: false,
    magnetometer: false,
    pedometer: false,
  });
  
  // Sensor data states
  const [accData, setAccData] = useState<SensorData>({ x: 0, y: 0, z: 0 });
  const [gyroData, setGyroData] = useState<SensorData>({ x: 0, y: 0, z: 0 });
  const [magData, setMagData] = useState<SensorData>({ x: 0, y: 0, z: 0 });
  const [stepCount, setStepCount] = useState(0);
  
  // Constants
  const STEP_LENGTH = 0.65; // Average step length in meters
  const SENSOR_UPDATE_INTERVAL = 100; // ms between sensor updates
  
  // Refs for calculations
  const lastUpdate = useRef<number>(Date.now());
  const kalmanX = useRef<KalmanFilter>({ x: 0, P: 1, Q: 0.1, R: 0.1 });
  const kalmanY = useRef<KalmanFilter>({ x: 0, P: 1, Q: 0.1, R: 0.1 });

  // Kalman filter implementation
  const kalmanFilter = (kalman: KalmanFilter, measurement: number): number => {
    // Prediction
    const P = kalman.P + kalman.Q;
    
    // Update
    const K = P / (P + kalman.R);
    kalman.x = kalman.x + K * (measurement - kalman.x);
    kalman.P = (1 - K) * P;
    
    return kalman.x;
  };

  // Check sensor availability
  useEffect(() => {
    const checkSensors = async () => {
      const accAvailable = await Accelerometer.isAvailableAsync();
      const gyroAvailable = await Gyroscope.isAvailableAsync();
      const magAvailable = await Magnetometer.isAvailableAsync();
      const pedAvailable = await Pedometer.isAvailableAsync();

      setSensorAvailability({
        accelerometer: accAvailable,
        gyroscope: gyroAvailable,
        magnetometer: magAvailable,
        pedometer: pedAvailable,
      });
    };

    checkSensors();
  }, []);

  // Initialize sensors
  useEffect(() => {
    let subscriptions: { remove: () => void }[] = [];

    const startTracking = async () => {
      try {
        // Set up sensor intervals
        await Promise.all([
          Accelerometer.setUpdateInterval(SENSOR_UPDATE_INTERVAL),
          Gyroscope.setUpdateInterval(SENSOR_UPDATE_INTERVAL),
          Magnetometer.setUpdateInterval(SENSOR_UPDATE_INTERVAL),
        ]);

        // Subscribe to sensors
        if (sensorAvailability.accelerometer) {
          subscriptions.push(Accelerometer.addListener(setAccData));
        }
        if (sensorAvailability.gyroscope) {
          subscriptions.push(Gyroscope.addListener(setGyroData));
        }
        if (sensorAvailability.magnetometer) {
          subscriptions.push(Magnetometer.addListener(setMagData));
        }
        if (sensorAvailability.pedometer) {
          subscriptions.push(
            Pedometer.watchStepCount(result => {
              setStepCount(result.steps);
            })
          );
        }

        // Load last known position
        const savedPosition = await AsyncStorage.getItem('lastPosition');
        if (savedPosition) {
          const parsed = JSON.parse(savedPosition);
          setPosition(parsed);
          kalmanX.current.x = parsed.x;
          kalmanY.current.x = parsed.y;
        }

        setIsTracking(true);
      } catch (error) {
        console.error('Error starting sensors:', error);
        setIsTracking(false);
      }
    };

    startTracking();

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, [sensorAvailability]);

  // Process sensor data
  useEffect(() => {
    if (!isTracking) return;

    const currentTime = Date.now();
    const deltaTime = (currentTime - lastUpdate.current) / 1000; // Convert to seconds
    lastUpdate.current = currentTime;

    // Calculate heading from magnetometer and gyroscope
    const heading = calculateHeading(magData, gyroData, deltaTime);

    // Update position based on step detection or accelerometer
    if (sensorAvailability.pedometer) {
      // Use pedometer for step-based updates
      updatePositionFromSteps(stepCount, heading);
    } else {
      // Fallback to accelerometer-based updates
      updatePositionFromAccelerometer(accData, heading, deltaTime);
    }
  }, [accData, gyroData, magData, stepCount, isTracking]);

  const calculateHeading = (mag: SensorData, gyro: SensorData, deltaTime: number): number => {
    // Combine magnetometer and gyroscope data for heading
    const magneticHeading = Math.atan2(mag.y, mag.x);
    const gyroHeading = position.heading + gyro.z * deltaTime;
    
    // Simple complementary filter
    const alpha = 0.95;
    return alpha * gyroHeading + (1 - alpha) * magneticHeading;
  };

  const updatePositionFromSteps = (steps: number, heading: number) => {
    const distance = (steps - stepCount) * STEP_LENGTH;
    if (distance === 0) return;

    const dx = Math.sin(heading) * distance;
    const dy = Math.cos(heading) * distance;

    // Apply Kalman filter to position updates
    const filteredX = kalmanFilter(kalmanX.current, position.x + dx);
    const filteredY = kalmanFilter(kalmanY.current, position.y + dy);

    const newPosition = {
      x: filteredX,
      y: filteredY,
      heading,
      accuracy: calculateAccuracy(),
    };

    setPosition(newPosition);
    onPositionUpdate(newPosition);
    savePosition(newPosition);
  };

  const updatePositionFromAccelerometer = (acc: SensorData, heading: number, deltaTime: number) => {
    // Remove gravity from acceleration
    const linearAcc = {
      x: acc.x - (acc.x * 0.1),
      y: acc.y - (acc.y * 0.1),
      z: acc.z - (9.81 + acc.z * 0.1),
    };

    // Double integration for position
    const dx = linearAcc.x * deltaTime * deltaTime * 0.5;
    const dy = linearAcc.y * deltaTime * deltaTime * 0.5;

    // Apply Kalman filter
    const filteredX = kalmanFilter(kalmanX.current, position.x + dx);
    const filteredY = kalmanFilter(kalmanY.current, position.y + dy);

    const newPosition = {
      x: filteredX,
      y: filteredY,
      heading,
      accuracy: calculateAccuracy(),
    };

    setPosition(newPosition);
    onPositionUpdate(newPosition);
    savePosition(newPosition);
  };

  const calculateAccuracy = (): number => {
    // Calculate position accuracy based on available sensors
    let accuracy = 5; // Base accuracy in meters
    if (sensorAvailability.pedometer) accuracy -= 1;
    if (sensorAvailability.magnetometer) accuracy -= 1;
    if (sensorAvailability.gyroscope) accuracy -= 1;
    return Math.max(accuracy, 1);
  };

  const savePosition = async (pos: Position) => {
    try {
      await AsyncStorage.setItem('lastPosition', JSON.stringify(pos));
    } catch (error) {
      console.error('Error saving position:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Position: ({position.x.toFixed(2)}, {position.y.toFixed(2)})
      </Text>
      <Text style={styles.text}>
        Heading: {(position.heading * 180 / Math.PI).toFixed(1)}°
      </Text>
      <Text style={styles.text}>
        Accuracy: ±{position.accuracy.toFixed(1)}m
      </Text>
      <Text style={styles.text}>
        Status: {isTracking ? 'Active' : 'Inactive'}
      </Text>
      {!isTracking && (
        <Text style={[styles.text, styles.error]}>
          Error: Some sensors unavailable
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    margin: 10,
  },
  text: {
    fontSize: 14,
    marginVertical: 2,
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default DeadReckoning; 