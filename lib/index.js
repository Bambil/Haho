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
const Joi = require('joi');

module.exports.register = function (server, userOptions, next) {

    const defaultOptions = {
        url: 'mqtt://127.0.0.1:1883',
        keepalive: 60,
        reschedulePings: true,
        clientId: 'haho_' + Math.random().toString(16).substr(2, 8),
        protocolId: 'MQTT',
        protocolVersion: 4
    };

    const options = Hoek.applyToDefaults(defaultOptions, userOptions);
    this.client = Mqtt.connect(options.url, options);
    this.subscriptions = {};

    server.expose('publish', (topic, message, publishOptions, callback) => {

        if (typeof publishOptions === 'function') {
            callback = publishOptions;
            publishOptions = undefined;
        }

        this.client.publish(topic, message, publishOptions, callback);
    });

    server.expose('subscribe', (subscriptions) => {

        for (const subscription of subscriptions) {
            const topic = subscription.topic;
            const callback = subscription.handler;
            const subscriptionOptions = subscription.options;
            const validator = subscription.validator;

            this.client.subscribe(topic, subscriptionOptions);

            this.subscriptions[topic] = {
                callback,
                validator
            };
        }

    });

    this.client.on('message', (messageTopic, message) => {

        if (messageTopic in this.subscriptions) {
            const s = this.subscriptions[messageTopic];

            if (s.validator) {
                const result = Joi.validate(JSON.parse(message.toString()), s.validator);
                if (result.error) {
                    return;
                }
                s.callback(messageTopic, JSON.parse(message.toString()), server);
            }
            else {
                s.callback(messageTopic, message.toString(), server);
            }
        }
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
