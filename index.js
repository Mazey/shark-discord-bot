var Discord = require("discord.js");
var client = new Discord.Client();

var Command = require("./commands.js");
var Config = require("./config.js");


client.on('ready', () => {
  	client.user.setGame('with fishies');

	Stargame = require("./modules/stargame.js")(client);
});

client.on('guildMemberAdd', (member) => {
  var channel = client.channels.get(Config.lobby_channel);
  channel.send("Welcome " + member.toString() + "! Don't forget to read the <#" + Config.rules_channel + "> and check out <#" + Config.information_channel + ">.");
});

client.on('message', (msg) => {
	if (msg.content[0] == Config.prefix && msg.guild) 
	{
		var s = msg.content.split(" ");
		var command = s[0].substring(1,s[0].length); 
		var params = new Array(); 
		if (s.length > 1)
		{
		  	for (var i = 1; i < s.length; i++) { 
		  		params[i-1] = s[i]; 
		  	}
		}

		var deleteMessage = onCommand(command, params, msg); 

		if (deleteMessage)
		{
			msg.delete(); // If the command is a valid command, let's remove it to keep the chat clean
		}
	}
});

// Command received
function onCommand(command, params, msg) { 
	var validCommand = true; // We only want to delete valid commands, let's assume the command is valid for now
	var paramCount;
	if (params != undefined)
		paramCount = params.length;
 
	switch (command)
	{ 
		case "role":
			if (paramCount == 1)
				Command.Role(params[0], msg.member);
		break;

		case "help":
			Command.Help(msg.member);
		break;

		case "captaineer": // !captains alias !role captains
			if (paramCount == 0)
				Command.Role("captaineer", msg.member);
		break;

		case "rule":
			if (paramCount == 1 || (paramCount == 2 && msg.mentions.members.size > 0))
				Command.Rule(msg.member, params[0], params[1], msg.channel);
		break;

		case "freeze":
			var mentions = msg.mentions.members;
			if (paramCount == 1 && mentions.size > 0)
			{
				Command.Freeze(msg.member, mentions.first());
			}
		break;

		default:
			validCommand = false; 
		break;
	}

	return validCommand
}

client.login(Config.key);