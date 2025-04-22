const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(__dirname + '/public'));

// MQTT setup
const mqttClient = mqtt.connect('mqtt://YOUR_MQTT_BROKER_URL'); // Replace with your broker URL
const topic = 'your/rgb/topic'; // Replace with your topic

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe(topic, (err) => {
    if (err) {
      console.error('Failed to subscribe:', err);
    }
  });
});

mqttClient.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString()); // {r:0,g:0,b:0}
    io.emit('rgb', data);
  } catch (err) {
    console.error('Invalid message format:', err);
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
