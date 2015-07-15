var plugAPI = require('plugapi');
var fs = require('fs');
var path = require('path');

var commands = require(path.resolve(__dirname, 'commands.js'));
var config = require(path.resolve(__dirname, 'config.json'));
var reconnectionAttempts=0;

bot = new plugAPI(config.auth);

bot.connect(config.roomName);
logger = plugAPI.CreateLogger('Bot');

bot.on('roomJoin',function(room){
    logger.success("Joined room",room);
    reconnectionAttempts=0;
});

bot.on("chat",function(data){
    //logger.info("chat:",JSON.stringify(data),":",data.message);
    //
    //chat: {"raw":{"cid":"3823277-1436894615110","message":"ola","sub":0,"uid":3823277,"un":"Rue Stephane"},
    //      "id":"3823277-1436894615110",
    //      "from":{"avatarID":"island-s04","badge":"isle08","gRole":0,"grab":false,"id":3823277,"joined":"2013-05-27 23:52:31.624000","language":null,"level":8,"role":3,"slug":null,"status":1,"sub":0,"username":"Rue Stephane","vote":1},
    //      "message":"ola",
    //      "mentions":[],
    //      "muted":false,
    //      "type":"message"}
    //
    //      {"raw":{"cid":"8266958-1436894615305","message":"ola","sub":0,"uid":8266958,"un":"Castigador da Parvoice"},"id":"8266958-1436894615305","from":{"avatarID":"base07","badge":null,"gRole":0,"grab":false,"id":8266958,"ignores":[],"joined":"2015-07-14 13:38:41.243226","language":"en","level":3,"notifications":[{"action":"levelUp","id":15762304,"timestamp":"2015-07-14 14:00:53.805598","value":"3"},{"action":"levelUp","id":15762071,"timestamp":"2015-07-14 13:43:41.379572","value":"2"}],"pp":1638,"pw":true,"role":0,"slug":"castigador-da-parvoice","status":1,"sub":0,"username":"Castigador da Parvoice","vote":0,"xp":122},"message":"ola","mentions":[],"muted":false,"type":"message"} : ola
    try{
        if (data.message.charAt(0)==='.')
        {
            logger.info("parsing command ",data.raw.un,":",data.message);
            commands.handle(data);
        }
    }
    catch (e)
    {
        logger.error("exception in chat event:",e);
    }
});

bot.on("chat:mention",function(data){
    try{
        logger.info("replying to mention: ",data)
        commands.replyMention(data);
    }
    catch (e)
    {
        logger.error("exception in chat_mention event:",e);
    }
});

bot.on("userJoin",function(data){

   try{
       //make a callback so it becomes asynchronous. If it was {User.join(data); commands.greet(data);}
       //the greet function would not execute exclusively after user.join, since that function has async
       //database access and it may finish execution at a later time. Using callback also allows to pass
       //information from the join function to the greet function.

       //User.join(data,function(){commands.greet(data);});
       commands.greet(data);
   }
   catch (e)
   {
       logger.error("exception in userJoin event:",e);
   }
});

bot.on("advance",function(data){
    try{
        //logger.info("music advancing: ",data)
        //Music.ended <-update last song with stats
        //Music.playing <-verify  if recently played, banned and other stuff
        commands.songChange(data);
    }
    catch (e)
    {
        logger.error("exception in advance event:",e);
    }
});

bot.on('close', reconnect);

bot.on('error', reconnect);



function reconnect() {

    if (reconnectionAttempts<config.maxReconnectionAttempts)
    {
        reconnectionAttempts+=1;
        logger.error("reconnecting ",reconnectionAttempts);
        bot.connect(config.roomName);
    }
    else
    {
        logger.error("Failed to connect, exiting");
        process.exit(2);
    }
}





