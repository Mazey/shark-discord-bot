var Config = {};

Config.key = "";
Config.prefix = "!";
Config.modroles = ["Moderator", "Administrator"];

Config.joinableRoles = {
	openRoles : ["Captaineer"],
	locationRoles : ["EU", "OC", "NA", "SA", "AN", "AF", "AS"]
};

Config.matchmaking_channel 	= "339006421721153537"; // #matchmaking
Config.lobby_channel 		= "337250580303052801"; // #general
Config.rules_channel 		= "361184531186712576"; // #rules
Config.information_channel 	= "337250654856675330"; // #information

Config.rules = [
	{
		alias : "commonsense",
		rule : "Use common sense."
	},
	{
		alias : "pg13",
		rule : "Keep it PG-13. (read: NSFW is a no-no)"
	},
	{
		alias : "hateful",
		rule : "Don't be a hateful. If you can't control your emotions, best take a break."
	},
	{
		alias : "softskinned",
		rule : "Don't be too soft-skinned. If you're getting flamed, tag a moderator and let them handle it."
	},
	{
		alias : "respect",
		rule : "Respect everyone. Talking smack can be fun but keep in mind that you're communicating with humans here."
	},
	{
		alias : "offtopic",
		rule : "We have many textchannels, such as #general and #modding, for example. Please communicate in the appropriate channels in order to keep this discord server nice and tidy. Channels which are only for KAG-related topics explicitly say so in their topics."
	},
	{
		alias : "controversial",
		rule : "Controversial topics such as politics are outside of the scope of this server, so please talk about them elsewhere."
	},
	{
		alias : "highlighting",
		rule : "Please refrain from highlighting/tagging users excessively or for no reason at all."
	},
	{
		alias : "advertising",
		rule : "You may not advertise your servers. If you want people to join your server, send them invites via PM."
	},
	{
		alias : "illegal",
		rule : "No illegal content."
	},
	{
		alias : "language",
		rule : "You are expected to talk English in this server. Messages in other languages may be removed."
	}
];

var ruleList = [];

for (var i = 0; i < Config.rules.length; i++) {
	ruleList[i] = Config.rules[i].alias + " (" + i + ")";
}

Config.helpMessage = `
**Help**
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

Config.helpMessage_Mod = `
**Additional moderator help**
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

module.exports = Config;