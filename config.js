var Config = {};

// Config
Config.key 			= "";	 // bot token
Config.prefix 			= "!";	 // command prefix
Config.modroles 		= [];	 // String[]
Config.abuser_role 		= "";	 // String

Config.joinableRoles = {
	openRoles : [], // String[]
	locationRoles : [] // String[]
};

// channel IDs
Config.lobby_channel 		= ""; // #general id
Config.offtopic_channel		= ""; // #offtopic id
Config.rules_channel 		= ""; // #rules id
Config.matchmaking_channel 	= ""; // #matchmaking id
Config.information_channel 	= ""; // #information id
Config.abuser_channel		= ""; // #frozen id

Config.rules = [ // Object[{String alias, String rule}]
	{
		alias : "example",
		rule : "An example rule"
	}
];

// DO NOT EDIT -----
var ruleList = [];

for (var i = 0; i < Config.rules.length; i++) {
	ruleList[i] = Config.rules[i].alias + " (" + i + ")";
}
// ----- DO NOT EDIT 


// Help messages
Config.helpMessage 		= ""; // help message
Config.helpMessage_Mod 		= ""; // mod help message

module.exports = Config;
