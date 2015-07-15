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
    else bot.sendChat("Sup @"+data.raw.un);
}

function greet(data)
{
    bot.sendChat("Hi @"+data.username+"!");
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
    "level":4,
    "handler":function(data){
        console.log("test add");

    }
};



var _help={
    "name":".help",
    "level":0,
    "handler":function(data){
        var str="";
        for (var i=0;i<commands.length;i++)
        {
            if (commands[i].level==1) //only show user commands, mods have to know their shit
                str+=commands[i].name+" ";
        }
        bot.sendChat("Available commands: "+str);
    }
};

var _info={
    "name":".info",
    "level":0,
    "handler":function(data){
        bot.sendChat("NI's plug moderator bot! Check the source and contribute at https://github.com/NIAEFEUP/PlugBot");
    }
}

var _woot={
    "name":".woot",
    "level":3,
    "handler":function(data){
        bot.woot();
        bot.moderateDeleteChat(data.raw.cid);
    }
}

var commands=[_add,_help,_info,_woot];