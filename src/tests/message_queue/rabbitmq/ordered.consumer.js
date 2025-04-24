'use strict'
const amqp = require('amqplib');


async function consumerOrderedMessage(){

  const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();

  const queueName = 'ordered-queued-message'
  await channel.assertQueue(queueName, { durable: true });

  //Set prefetch
  channel.prefetch(1) // 1 message at a time

  channel.consume( queueName, (msg) => {
    const message = msg.content.toString()
    console.log(`Received message: ${message}`);

    //Real life example when message is processed different time
    setTimeout(() => {
      console.log(`Processing message: ${message}`);
      channel.ack(msg) // Acknowledge the message (if success then ack)
    } , Math.random() * 1000)
  })
}

consumerOrderedMessage().catch(err => console.error(err))