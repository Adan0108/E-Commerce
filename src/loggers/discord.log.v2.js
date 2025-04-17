'use strict'
require('dotenv').config(); 
const{
  DISCORD_CHANNEL,
  DISCORD_TOKEN
} = process.env
const { Client , GatewayIntentBits } = require('discord.js')
class LoggerService{
  constructor(){
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })

    //add chanelId
    this.channelId = DISCORD_CHANNEL
    this.client.on('ready', () => {
      console.log(`Loggin as ${this.client.user.tag}`)
    })
    
    this.client.login(DISCORD_TOKEN)
  }

  sendToFormatCode(logData){
    const { code, message = 'This is some additional information about the code.', title = 'Code Example'} = logData;
    if(1 === 1){
      //product and dev
      //xu ly xem co log hay khong ???
    }
    const codeMessage = 
    {
        content: message,
        embeds: [
        {
          color: parseInt('00ff00',16),//convert hexadecimal color code to integer
          title,
          description: '```json\n' + JSON.stringify(code,null,2) + '\n```',
        },
      ],
    }
    this.sendToMessage(codeMessage)
  }
  sendToMessage(message = 'message'){
    const channel = this.client.channels.cache.get(this.channelId)
    if(!channel){
      console.error(`Couldn't find the channel ...`, this.channelId)
      return;
    }
    //message use CHAT GPT API CALL (for advance)
    channel.send(message).catch(e => console.error(e))
  }
}
// const loggerService = new LoggerService();
module.exports = new LoggerService()