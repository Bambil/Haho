# Haho
Haho mqtt plugin for hapi.js.

> Paho Mqtt moves into Hapi then they call it Haho. :stuck_out_tongue_winking_eye:

## Usage

```javascript
const Hapi = require('hapi');


const server = new Hapi.Server();

server.connection({
    port: '9090'
});

server.register({
    register: require('Haho'),
    options: {
        url: 'mqtt://localhost:1883'
    }
}, (err) => {

    if (err) {
        console.log('Failed loading plugin');
    }
    
    const haho = server.plugins.haho;
    haho.subscribe('test/hello', (topic, message) => {

        console.log('message', message);
    });
    
    /* start the server after plugin registration */
    server.start((err) => {

        if (err) {
            console.log('error when starting server', err);
        }
        console.log('service started');
    });
});


```
