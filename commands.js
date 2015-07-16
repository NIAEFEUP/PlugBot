exports.handle = handle;
exports.replyMention = replyMention;
exports.greet = greet;
exports.songChange = songChange;

function handle(data)
{
    for (var i=0;i<commands.length;i++)
    {
        if (data.message.slice(0,commands[i].name.length) === commands[i].name && data.from.role>=commands[i].level) {
            commands[i].handler(data);
            break;
        }
    }
    if (i==commands.length)
    {
        bot.sendChat("Unknown command, try .help");
    }
}

function replyMention(data)
{
    //basic test, want to add some conversation module
    var msg=data.message;
    if (msg.search("fish")!=-1)
        bot.sendChat("fish go m00");
    else if (msg.search("cows")!=-1)
        bot.sendChat("cows go blub");
    else if (msg.search(/(grande som|alto som|this is nice)/i)!=-1 && data.from.role>=3)
    {
        bot.woot();
        bot.sendChat("Indeed");
    }
    else if (msg.search("plz disconnect")!=-1 && data.from.role>=3)
    {
        //this should be a command. However this allows to dictate which bot disconnects, useful when using the test bot!
        bot.moderateDeleteChat(data.raw.cid);
        disconnect();
    }
    else bot.sendChat("Sup @"+data.raw.un);
}

function greet(data)
{
    if (data.username&&data.username!==config.myName)
    {
        bot.sendChat("Hi @"+data.username+"!");
    }
}

function songChange(data)
{
    if (data.currentDJ.role>0)
    {
        //gotta woot the overlords
        bot.woot();
    }
}

// command levels: 0-user,1-dj,2-bouncer,3-manager,4-host

//add user to queue
var _add={
    "name":".add",
    "level":3,
    "handler":function(data){
        //add to queue
        //move() to requested position

    }
};

//mehs the current song
var _meh={
    "name":".meh",
    "level":3,
    "handler":function(data){
        bot.meh();
        bot.moderateDeleteChat(data.raw.cid);
    }
}

//move user in queue
var _move={
    "name":".add",
    "level":3,
    "handler":function(data){
        //move()
    }
};

//show available user commands
var _help={
    "name":".help",
    "level":0,
    "handler":function(data){
        var str="";
        for (var i=0;i<commands.length;i++)
        {
            if (commands[i].level<1&&commands[i].hidden!==true) //only show user commands, mods have to know their shit
                str+=commands[i].name+" ";
        }
        bot.sendChat("Available commands: "+str);
    }
};

//display information about the bot
var _info={
    "name":".info",
    "level":0,
    "handler":function(data){
        bot.sendChat("NI's plug moderator bot! Check the source and contribute at https://github.com/NIAEFEUP/PlugBot");
    }
}

//skip the current song and provide a reason
var _skip={
    "name":".skip",
    "level":2,
    "hidden":true,
    "handler":function(data){
        bot.moderateForceSkip(function(){
            bot.sendChat("Music skipped by @"+data.raw.un+":"+data.msg.slice(_skip.name.length));
        });
        bot.moderateDeleteChat(data.raw.cid);
    }
}

//woots the current song
var _woot={
    "name":".woot",
    "level":3,
    "handler":function(data){
        bot.woot();
        bot.moderateDeleteChat(data.raw.cid);
    }
}

//tro.trololol
var commands=[_add,_help,_meh,_info,_woot,_skip];


//helper functions (DO NOT REPEAT YOURSELF)
function move()
{

}

function disconnect()
{
    bot.sendChat("BRB guys");
    logger.success("Exiting at request");
    //bot.disconnect() doesn't exist, maybe implement it in the future
    setTimeout(function (){process.exit(0);},100);
}