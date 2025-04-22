const amqp = require('amqplib');

const message =  'hello , RabbitMQ for Adan108'

const runProducer = async() => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();

    const queueName = 'test-topic'
    await channel.assertQueue(queueName, { durable: true });
    
    //send message to consumer channel
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`Message sent to queue ${queueName}: message ":${message}`);


  } catch (error) {
    console.error(error);
  }
}

runProducer().catch(console.error)