const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

const RegionalRoles = require("./modules/regionalroles.js")();
const OpenRoles = require("./modules/openroles.js")();
const Help = require("./modules/help.js");
var StarGame;

client.on('ready', () => {
<<<<<<< HEAD
	client.user.setPresence({ status: 'online', game: { name: `with fishies` } });

	Stargame = require("./modules/stargame.js")(client);
	Serverlist = require("./modules/serverlist.js")(client);
=======
	client.guilds.first().fetchMembers();
	StarGame = require("./modules/stargame.js")(client);
  	client.user.setGame('with fishies');

  	PlayerCount = require("./modules/playercount.js")(client);
	PlayerCount.updatePlayerCount();
	client.setInterval(PlayerCount.updatePlayerCount, 60 * 1000 * 2);
>>>>>>> master
});

client.on('guildMemberAdd', (member) => {
  var channel = client.channels.get(config.welcome_channel);
  channel.send(`Welcome ${member.toString()}! Please read the <#${config.rules_channel}> and check out <#${config.information_channel}>.`);
});

client.on('message', (msg) => {
<<<<<<< HEAD
	// modules
	Stargame.onMessage(msg);

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
=======
	StarGame.onMessage(msg);

	if (msg.content[0] == config.prefix) { // commands
		var cmd = commandify(msg);

		if (cmd.command == "role") {
			OpenRoles.onCommand(msg, cmd);
			RegionalRoles.onCommand(msg, cmd);
			return;
		}
>>>>>>> master

		if (cmd.command == "help") {
			Help.send(msg.member, is_mod(msg.member));
			return;
		}
	}
});

<<<<<<< HEAD
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
			else
				validCommand = false;
		break;

		case "help":
			Command.Help(msg.member);
		break;

		case "captaineer": // !captains alias !role captains
			if (paramCount == 0)
				Command.Role("captaineer", msg.member);
			else
				validCommand = false;
		break;

		case "rule":
			if (isMod(msg.member) && (paramCount == 1 || (paramCount == 2 && msg.mentions.members.size > 0)))
				Command.Rule(msg.member, params[0], params[1], msg.channel);
			else
				validCommand = false;
		break;

		case "freeze":
			var mentions = msg.mentions.members;
			if (isMod(msg.member) && paramCount == 1 && mentions.size > 0)
				Command.Freeze(msg.member, mentions.first());
			else
				validCommand = false;
		break;

		case "ping":
			if (isMod(msg.member) && paramCount == 0) {
				Command.Ping(msg.channel);
			} else {
				validCommand = false;
			}
		break;

		default:
			validCommand = false;
		break;
	}
=======
function commandify(msg) {
	var cmd = new Object();

	_content = msg.content.split(" "); 

	cmd.command = _content[0].replace(config.prefix, "");

	_content.shift();
	cmd.params = _content;
>>>>>>> master

	return cmd;
}

function is_mod(member) {
	var mod = false;
	config.mod_roles.forEach((modrole) => {
		var modRole = member.guild.roles.find("name", modrole);
		if (member.roles.has(modRole.id)) {
			mod = true;;
		}
	});

	return mod;
}

client.login(config.token);