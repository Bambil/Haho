# Haho
Haho mqtt plugin for hapi.js

## Usage

```javascript
const Hapi = require('hapi');
const Haho = require('../lib');


const server = new Hapi.Server();

server.connection({
    port: '9090'
});

server.register({
    register: Haho,
    options: {
        url: 'mqtt://192.168.73.5:1883'
    }
}, (err) => {

    if (err) {
        console.log('Failed loading plugin');
    }

    server.start((err) => {

        if (err) {
            console.log('error when starting server', err);
        }
        console.log('service started');
    });
});

const haho = server.plugins.haho;
haho.subscribe('test/hello', (topic, message) => {

    console.log('message', message);
});
```
