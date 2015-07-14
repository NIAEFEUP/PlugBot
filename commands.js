exports.handle = handle;
exports.replyMention = replyMention;
exports.greet = greet;

function handle(data)
{
    for (var i=0;i<commands.length;i++)
    {
        if (data.message.slice(0,commands[i].name.length) === commands[i].name) {
            //missing permission level check
            commands[i].handler(data);
            break;
        }
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
    bot.sendChat("Ol� @"+data.username+"!");
}

// command levels: 1-user,2-dj,3-bouncer,4-manager,5-host

//add user to queue
var _add={
    "name":".add",
    "level":3,
    "handler":function(data){
        console.log("test add");

    }
};



var _help={
    "name":".help",
    "level":1,
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

var commands=[_add,_help];