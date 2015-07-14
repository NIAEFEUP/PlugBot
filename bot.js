var plugAPI = require('plugapi');
var fs = require('fs');
var path = require('path');

var config = require(path.resolve(__dirname, 'config.json'));

bot = new plugAPI(config.auth);

bot.connect(config.roomName);

bot.on('roomJoin',function(room){
    bot.log("Connected to "+room);
    bot.sendChat("Hello. This is a test @Rue Stephane");
    //bot.disconnect()
});
//console.log("Connected to ",config.roomName);
/*bot.on('close', reconnect);
bot.on('error', reconnect);

function reconnect() {
    console.log("reconnecting");
    bot.connect(config.roomName);
}
*/


