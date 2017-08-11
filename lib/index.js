/*
 * +===============================================
 * | Author:        Parham Alvani <parham.alvani@gmail.com>
 * |
 * | Creation Date: 12-08-2017
 * |
 * | File Name:     index.js
 * +===============================================
 */
'use strict';

const Mqtt = require('mqtt');
const Hoek = require('hoek');

module.exports.register = function (server, userOptions, next) {

    const defaultOptions = {
        url: 'mqtt://127.0.0.1:1883',
        keepalive: 60,
        reschedulePings: true,
        clientId: 'haho_' + Math.random().toString(16).substr(2, 8),
        protocolId: 'MQTT',
        protocolVersion: '4'
    };

    const options = Hoek.applyToDefaults(defaultOptions, userOptions);
    this.client = Mqtt.connect(options.url, options);

    server.expose('publish', (topic, message, publishOptions, callback) => {

        if (typeof publishOptions === 'function') {
            callback = publishOptions;
            publishOptions = undefined;
        }

        this.client.publish(topic, JSON.stringify(message), publishOptions, callback);
    });

    server.expose('subscribe', (topic, subscribeOptions, callback) => {

        if (typeof subscribeOptions === 'function') {
            callback = subscribeOptions;
            subscribeOptions = undefined;
        }

        this.client.subscribe(topic, subscribeOptions);

        this.client.on('message', (messageTopic, message) => {

            if (messageTopic === topic) {
                callback(topic, JSON.parse(payload.toString()));
            }
        });
    });

    this.client.on('connect', () => {

        next();
    });

    this.client.on('error', (err) => {

        next(err);
    });
};

module.exports.register.attributes = {
    pkg: require('../package.json')
};
