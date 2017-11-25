// Init
var Discord = require("discord.js");
var Command = require("./commands.js");
var Config = require("./config.js");

var client = new Discord.Client();

client.on('ready', () => {
  	console.log("Ready!");
  	client.user.setGame('with fishies');
});

// Message
client.on('message', (msg) => {
	// Do we spot a command? and are we in our server
	if (msg.content[0] == Config.prefix && msg.guild) 
	{
		var s = msg.content.split(" ");

		// Get the command without the prefix
		var command = s[0].substring(1,s[0].length); 

		// Checking for parameters
		var params = new Array(); 
		if (s.length > 1)
		{
			// Start at 1 so we skip the command name
		  	for (var i = 1; i < s.length; i++) { 
		  		params[i-1] = s[i]; 
		  	}
		}
		
		// Send out the command
		var deleteMessage = onCommand(command, params, msg.member, msg); 

		if (deleteMessage)
		{
			// If the command is a valid command, let's remove it to keep the chat clean
			msg.delete();
		}
	}
});

// Command received
function onCommand(command, params, msg) { 
	// We want to delete valid commands, let's assume the command is valid for now
	var validCommand = true; 
	var paramCount;
	if (params != undefined)
		paramCount = params.length;
 
 	// Check if command is valid
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
				onCommand('role', Array('captaineer'), msg.member);
		break;

		case "rule":
			if (paramCount == 1 || (paramCount == 2 && msg.mentions.users.array().length > 0))
				Command.Rule(msg.member, params[0], params[1], msg.channel);
		break;

		default:
			// The command is not valid
			validCommand = false; 

			// console.log("Unknown command " + command);
		break;
	}

	return validCommand
}

client.login(Config.key);