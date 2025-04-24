const amqp = require('amqplib');

const message =  'hello , RabbitMQ for Adan108'

const log = console.log
console.log = function(){
  log.apply(console, [new Date()].concat(arguments))
}

const runProducer = async() => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();

    const notificationExchange = 'notificationEx' //notificationEx direct
    const notiQueue = 'notificationQueueProcess' //assrtQueue
    const notificationExchangeDLX = 'notificationExDLX' //notificatio direct\
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' //assert

    //1. Create Exchange
    await channel.assertExchange(notificationExchange, 'direct', { 
      durable: true 
    });

    //2. Create Queue
    const queueResult = await channel.assertQueue(notiQueue, { 
      exclusive: false, //cho phep cac ket noi try cap vao cung luc hang doi
      //neu 1 tin nhan ma het han hoac loi thi no se gui den san DLX voi khoa DLXkey
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,  
    });

    //3. bindQueue   
    await channel.bindQueue(queueResult.queue, notificationExchange);



    //4. Send message
    const msg = 'a new product '
    console.log(`producer message :`, msg)
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg),{
      expiration: 10000, //10s
    })

    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 500)

  } catch (error) {
    console.error(error);
  }
}

runProducer().catch(console.error)