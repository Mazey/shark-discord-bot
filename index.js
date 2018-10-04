const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

// const RegionalRoles = require("./modules/regionalroles.js")();
// const OpenRoles = require("./modules/openroles.js")();
// const Help = require("./modules/help.js");
var StarGame;

client.on('ready', () => {
	console.log('Bot started!');

	client.guilds.first().fetchMembers();
	client.user.setPresence({ status: 'online', game: { name: `with fishies` } });

	// StarGame = require("./modules/stargame.js")(client);
	ServerList = require("./modules/serverlist.js")(client);
});

client.on('guildMemberAdd', (member) => {
  var channel = client.channels.get(config.welcome_channel);
  channel.send(`Welcome ${member.toString()}! Please read the <#${config.rules_channel}> and check out <#${config.information_channel}>.`);
});

client.on('message', (msg) => {
	if (msg.author.bot) return;

	StarGame.onMessage(msg);

	if (msg.content[0] == config.prefix) { // commands
		var cmd = commandify(msg);

		if (cmd.command == "role") {
			OpenRoles.onCommand(msg, cmd);
			RegionalRoles.onCommand(msg, cmd);
			return;
		}

		if (cmd.command == "help") {
			Help.send(msg.member, is_mod(msg.member));
			return;
		}
	}
});

function commandify(msg) {
	var cmd = new Object();

	_content = msg.content.split(" ");

	cmd.command = _content[0].replace(config.prefix, "");

	_content.shift();
	cmd.params = _content;

	return cmd;
}

function is_mod(member) {
	var mod = false;
	config.mod_roles.forEach((modrole) => {
		var modRole = member.guild.roles.find("name", modrole);
		if (modRole && member.roles.has(modRole.id)) {
			mod = true;
		}
	});

	return mod;
}

client.login(config.token);