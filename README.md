# Haho
Haho mqtt plugin for hapi.js.

> Paho Mqtt moves into Hapi then they call it Haho. :P

## Usage

```javascript
const Hapi = require('hapi');
const Haho = require('haho');


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

    /* start the server after plugin registration */
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
