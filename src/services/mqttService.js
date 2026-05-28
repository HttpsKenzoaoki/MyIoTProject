import init from 'react-native-mqtt';
import sqlite from 'expo-sqlite';


init({
    size: 10000,
    storageBackend: sqlite,
    defaultExpires: 1000 * 3600 *24,
    enableCache: true,
    sync: {},
});


export default class MqttService {
  constructor() {
    this.client = null;
  } 


connect(configureLayoutAnimationBatch, onmessage, onConnect, onFailure) {
 const { host, port, path, user, pass, clientID } = config;

 this.client = new Paho.MQTT.Client(host, port, path, clientID);

 this.client.onMessageArrived = (message) => {
    onMessage(message.destinationName, message.payloadString);
 };

 const options = {
    userName: user,
    passWord: pass,
    useSSL: true,
    onSuccess: onConnect,
    onFailure: onFailure,
    timeout: 3,
    keepAliceInterval:60,
 };

 this.client.connect(options);
}

 subscribe(topic) {
    this.client.subscribe(topic);
 }

 publish(topic, message) {
    const msg = new Paho.MQTT.Message(message);
    msg.destinationName = topic;
    this.client.send(msg);
 }
}
