// push_status.js — Push status to Clawd Mochi via MQTT
// Usage: node push_status.js <think|work|idle>
// Maps to MQTT topic clawd/mochi/cmd with payload t/k/w

const mqtt = require('mqtt');
const cmd = process.argv[2];

const MAP = { think: 't', work: 'k', idle: 'w' };

if (!MAP[cmd]) {
  console.error('Usage: node push_status.js <think|work|idle>');
  process.exit(1);
}

const client = mqtt.connect('mqtt://broker.emqx.io:1883', {
  clientId: 'clawd-pusher-' + Math.random().toString(16).slice(2, 8),
  clean: true,
  connectTimeout: 5000
});

client.on('connect', () => {
  client.publish('clawd/mochi/cmd', MAP[cmd], {}, () => {
    console.log(`Sent: ${cmd} → clawd/mochi/cmd "${MAP[cmd]}"`);
    client.end();
    process.exit(0);
  });
});

client.on('error', (e) => {
  console.error('MQTT error:', e.message);
  process.exit(1);
});

setTimeout(() => { console.error('Timeout'); process.exit(1); }, 8000);
