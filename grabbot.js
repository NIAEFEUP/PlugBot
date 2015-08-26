var plugAPI = require('plugapi');
var fs = require('fs');
var path = require('path');


var config = require(path.resolve(__dirname, 'configGrab.json'));
var reconnectionAttempts=0;

try{
    bot = new plugAPI(config.auth);
    bot.connect(config.roomName);
}
catch(e){
    console.error("exception during connection attempt, exiting"); //connection timeouts should go to the reconnect event rather than here, needs confirmation
    process.exit(3);
}
logger = plugAPI.CreateLogger('Bot');

bot.on('roomJoin',function(room){
    logger.success("Joined room",room);
    setTimeout(function(){createActivatePlaylist(config.playlistName)},1000);
    reconnectionAttempts=0;
});

bot.on("advance",function(data){
    try{
        //logger.info("music advancing: ",data)
        //Music.ended <-update last song with stats
        //Music.playing <-verify  if recently played, banned and other stuff
        logger.info(JSON.stringify(data.media));
        setTimeout(function(){
            bot.grab();
        },5000);
    }
    catch (e)
    {
        handleException(e,"advance event",data);
    }
});

bot.on('close', reconnect);

bot.on('error', reconnect);

function getPlaylistByName(lists,name){
    if (lists !== undefined)
    {
        for (var i = 0; i < lists.length; i++) {
            if (lists[i].name === name) {
                return lists[i].id;
            }
        }
    }
    return false;
}

function createActivatePlaylist(name)
{
    try {
        bot.getPlaylists(function(data)
        {
            logger.info(JSON.stringify(data));
            var found = getPlaylistByName(data,name);
            if (!found) {
                bot.createPlaylist(name, function (data) {
                    logger.info("created Playlist");
                    logger.info(JSON.stringify(data));
                    bot.getPlaylists(function(data)
                    {
                        logger.info(JSON.stringify(data));
                        var found = getPlaylistByName(data,name);
                        if (!found) {
                            logger.error("Failed to create playlist, exiting");
                            process.exit(5);
                        }
                        else{
                            logger.info("found playlist "+name+" "+found);
                            bot.activatePlaylist(found);
                        }
                    });

                });
            }
            else{
                logger.info("found playlist "+name+" "+found);
                bot.activatePlaylist(found);
            }
        });
    }
    catch (e)
    {
        handleException(e,"create playlist",null);
        process.exit(4);
    }
}

function reconnect() {
    //doesn't really reconnect
    logger.error("Failed to connect, exiting");
    process.exit(2);
}

function handleException(e,source,data)
{
    logger.error("exception in ",source,"\nerror:",e," \ndata:",data);
}

