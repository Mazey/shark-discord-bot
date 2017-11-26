var Commands = {};
var Config = require("./config.js");

////////// ROLE COMMAND
Commands.Role = function(param, member) 
{
	if (!member) return;

	var openRoles = Config.joinableRoles.openRoles;
	var locationRoles = Config.joinableRoles.locationRoles;
	var _split = "~~~";

	if (!(openRoles.join(_split).toLowerCase().split(_split).includes(param.toLowerCase()) || locationRoles.join(_split).toLowerCase().split(_split).includes(param.toLowerCase())))
	{
		member.send("You may not join role `" + param + "` or it does not exist.");
		return;
	}

	var serverRoles = member.guild.roles;

	// Is the user requesting an 'open' role?
	openRoles.forEach((r) => {
		if (r.toLowerCase() == param.toLowerCase()) 
		{
			var role = serverRoles.find("name", r);	

			if (!member.roles.has(role.id))
				member.addRole(role);
			else
				member.removeRole(role);

			return; 
		}
	});

	// Is the user requesting a location role?
	locationRoles.forEach((r) => {
		var role = serverRoles.find("name", r);

		if (!member.roles.has(role.id) && r.toLowerCase() == param.toLowerCase()) 
			member.addRole(role);
		else
			member.removeRole(role);
	});
};

////////// HELP COMMAND
Commands.Help = function(member)
{
	member.send(Config.helpMessage);

	// Send extra mod help if user is moderator
	Config.modroles.forEach((modrole) => {
		var modRole = member.guild.roles.find("name", modrole);
		if (member.roles.has(modRole.id))
		{
			member.send(Config.helpMessage_Mod);
			return;
		}
	});
};

////////// RULE COMMAND
Commands.Rule = function(member, rule, user, channel)
{
	if (!isMod(member))
		return; 

	var tagUser = !(user == undefined);

	var _rule;

	if (rule < Config.rules.length)
	{
		_rule = Config.rules[rule].rule;
	}
	else // Maybe the callee supplied an alias then?
	{
		for (var i = 0; i < Config.rules.length; i++) {
			if (Config.rules[i].alias.toLowerCase().startsWith(rule.toLowerCase()))
				_rule = Config.rules[i].rule;
		}
		if (_rule == undefined)
		{
			member.send("That rule doesn't exist.");
			return;
		}
	}

	channel.send((tagUser ? user + ": " : "" ) + _rule);
};

Commands.Freeze = function(member, user)
{
	if (!isMod(member)) return;

	var channel = client.channels.get(Config.abuser_channel);
	var role = member.guild.roles.find("name", Config.abuser_role);

	if (!user.roles.has(role.id))
	{
		user.addRole(role);
		channel.send(user.toString() + " you have been frozen by " + member.toString() + " for abusive behavior. It will dealt with here.");
	}
	else
	{
		user.removeRole(role);
		channel.send(user.toString() + " has been unfrozen by " + member.toString());
	}

}

function isMod(member) {
	var mod = false;
	Config.modroles.forEach((modrole) => {
		var modRole = member.guild.roles.find("name", modrole);
		if (member.roles.has(modRole.id))
		{
			mod = true;;
		}
	});

	return mod;
}

module.exports = Commands;