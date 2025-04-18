// src/services/redisPubsub.service.js
'use strict';

const { createClient } = require('redis');

class RedisPubSubService {
  constructor() {
    // create clients
    this.publisher  = createClient();
    this.subscriber = createClient();

    // connect once and keep the connections open
    this._ready = Promise.all([
      this.publisher.connect(),
      this.subscriber.connect()
    ]);

    //log connection problems
    this.publisher.on('error',  console.error);
    this.subscriber.on('error', console.error);
  }

  /** Publish a message (returns a promise) */
  async publish(channel, message) {
    await this._ready;                // make sure we’re connected
    return this.publisher.publish(channel, message); // ← returns a promise in v4
  }

  /** Subscribe and invoke your handler when a message arrives */
  async subscribe(channel, handler) {
    await this._ready;
    await this.subscriber.subscribe(channel, raw => {
      handler(channel, raw);          // raw is a string
    });
  }
}

module.exports = new RedisPubSubService();
