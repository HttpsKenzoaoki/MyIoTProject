import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import MQTTService from './src/services/mqttService';
import StatusModal from './src/components/StatusModal';
import LightControl from './src/components/LightControl';
import Gauges from './src/components/Gauges';
import MessageHistory from './src/components/MessageHistory';

const mqtt = new MQTTService();

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const mqttConfig = {
    host: process.env.EXPO_PUBLIC_MQTT_HOST,
    port: parseInt(process.env.EXPO_PUBLIC_MQTT_PORT),
    path: process.env.EXPO_PUBLIC_MQTT_PATH,
    user: process.env.EXPO_PUBLIC_MQTT_USER,
    pass: process.env.EXPO_PUBLIC_MQTT_PASS,
    clientId: 'RN_App_' + Math.random(),
  };

  useEffect(() => {
    startConnection();
  }, []);

  const startConnection = () => {
    setShowError(false);
    mqtt.connect(
      mqttConfig,
      (topic, message) => {
        if (topic === 'casa/temp') setTemp(parseFloat(message));
        if (topic === 'casa/umid') setHum(parseFloat(message));
        if (topic === 'casa/luz') setIsLightOn(message === "1");
      },
      () => {
        setIsConnected(true);
        mqtt.subscribe('casa/temp');
        mqtt.subscribe('casa/umid');
        mqtt.subscribe('casa/luz');
      },
      (err) => {
        setIsConnected(false);
        setShowError(true);
      }
    );
  };

  const toggleLight = () => {
    const newState = isLightOn ? "0" : "1";
    mqtt.publish('casa/luz', newState);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Smart Home IoT</Text>

      <LightControl isLightOn={isLightOn} onToggle={toggleLight} />

      <Gauges temp={temp} hum={hum} />

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowHistory(!showHistory)}
      >
        <Text style={styles.toggleButtonText}>
          {showHistory ? '▼ Ocultar Histórico' : '▶ Mostrar Histórico'}
        </Text>
      </TouchableOpacity>

      {showHistory && <MessageHistory />}

      <StatusModal
        visible={showError}
        onRetry={startConnection}
        onLater={() => setShowError(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  toggleButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
  },
  toggleButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});