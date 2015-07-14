var plugAPI = require('plugapi');
var fs = require('fs');
var path = require('path');

var config = require(path.resolve(__dirname, 'config.json'));

bot = new plugAPI(config.auth);

bot.connect(config.roomName);
logger = plugAPI.CreateLogger('Bot');

bot.on('roomJoin',function(room){
    logger.success("Joined room",room)
    //bot.log("Connected to "+room);
    //bot.sendChat("Hello. This is a test");

});

bot.on("chat",function(data){

   logger.info("chat:",JSON.stringify(data),":",data.message);
    if (data.raw.un!== "Castigador da Parvoice") bot.sendChat("ola");
    //bot.disconnect();
});
//console.log("Connected to ",config.roomName);
/*bot.on('close', reconnect);
bot.on('error', reconnect);

function reconnect() {
    console.log("reconnecting");
    bot.connect(config.roomName);
}
*/


