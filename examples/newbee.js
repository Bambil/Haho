'use strict';

const Hapi = require('hapi');
const Haho = require('../lib');


const server = new Hapi.Server();

server.connection({
    port: '9090'
});

server.register({
    register: Haho,
    options: {
        url: 'mqtt://127.0.0.1:1883'
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
        haho.publish('test/hello', 'Hi');
    });
});

const haho = server.plugins.haho;

haho.subscribe([
    {
        topic: 'test/hello',
        handler: (topic, message) => {

            console.log('message', message);
        }
    }
]);
