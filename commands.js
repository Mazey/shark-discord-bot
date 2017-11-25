var Config = require("./config.js");

var helpMessage = `**Help**
**Commands:**
`+'```'+`
!role <role> 	- Add or remove a role

	Open roles: `+ Config.joinableRoles.openRoles.join(', ') + `
		Example: !role `+ Config.joinableRoles.openRoles[0] + `

	Continental roles (you are limited to one): `+ Config.joinableRoles.locationRoles.join(', ') + `
		Example: !role `+ Config.joinableRoles.locationRoles[0] + `

!help 		   - Sends you this dialog
`+'```'+`

**Captaineer:**
You can read more about the "Captaineer" role in <#`+ Config.matchmaking_channel +`>'s topic.`;



var ruleList = [];

for (var i = 0; i < Config.rules.length; i++) {
	ruleList[i] = Config.rules[i].alias + " (" + i + ")";
}

var helpMessage_Mod = `**Additional moderator help**
**Commands:**
`+'```'+`
!rule <rule> <user>	- Make the bot say a rule, and optionally tag a user
					   - Rule can be a rule number or a pre-defined alias (or part of an alias)
	
	Rules: `+ ruleList.join(", ") +`
		Example: 
				- !rule 4
				- !rule pg13 @johnny98
				- !rule softsk
`+'```';

module.exports = {
	Config : require("./config.js"),


	////////// ROLE COMMAND
	Role : function(param, member) 
	{
		var openRoles = Config.joinableRoles.openRoles;
		var locationRoles = Config.joinableRoles.locationRoles;

		// Only continue if there is a point in continuing
		if (!(openRoles.join("~").toLowerCase().split("~").includes(param.toLowerCase()) || locationRoles.join("~").toLowerCase().split("~").includes(param.toLowerCase())))
		{
			member.send("You may not join role `" + param + "` or it does not exist.");
			return;
		}

		var serverRoles = member.guild.roles;

		// Is the user requesting an 'open' role?
		openRoles.forEach((r) => {
			if (r.toLowerCase() == param.toLowerCase()) 
			{
				// Seems like it

				var role = serverRoles.find("name", r);	

				if (!member.roles.has(role.id))
					member.addRole(role);
				else
					member.removeRole(role);

				// We're done here
				return; 
			}
		});

		// Is the user requesting a location role?
		locationRoles.forEach((r) => {
			var role = serverRoles.find("name", r);

			// You don't have the role but you want the role
			if (!member.roles.has(role.id) && r.toLowerCase() == param.toLowerCase()) 
				member.addRole(role);
			else
				member.removeRole(role);
		});
	},


	////////// HELP COMMAND
	Help : function(member)
	{
		// Send help message
		member.send(helpMessage);

		// Send extra mod help if user is moderator
		Config.modroles.forEach((modrole) => {
			var modRole = member.guild.roles.find("name", modrole);
			if (member.roles.has(modRole.id))
			{
				member.send(helpMessage_Mod);
			}
		});
	},


	////////// RULE COMMAND
	Rule : function(member, rule, user, channel)
	{
		var isMod = false;

		Config.modroles.forEach((modrole) => {
			var modRole = member.guild.roles.find("name", modrole);
			if (member.roles.has(modRole.id))
			{
				isMod = true;
			}
		});

		if (!isMod) // User isn't a moderator, abort
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
				if (Config.rules[i].alias.toLowerCase().startsWidth(rule.toLowerCase()))
					_rule = Config.rules[i].rule;
			}
			if (_rule == undefined)
			{
				member.send("That rule doesn't exist.");
				return;
			}
		}

		channel.send((tagUser ? user + ": " : "" ) + _rule);
	}
}