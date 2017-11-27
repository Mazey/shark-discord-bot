var Config = {};

// Config
Config.key 			= "";	 // bot token
Config.prefix 			= "!";	 // command prefix
Config.modroles 		= [];	 // String[] name
Config.abuser_role 		= "";	 // String name

Config.joinableRoles = {
	openRoles : [], // String[] name
	locationRoles : [] // String[] name
};

// channel IDs
Config.lobby_channel 		= ""; // #general id
Config.offtopic_channel		= ""; // #offtopic id
Config.rules_channel 		= ""; // #rules id
Config.matchmaking_channel 	= ""; // #matchmaking id
Config.information_channel 	= ""; // #information id
Config.abuser_channel		= ""; // #frozen id

Config.abusers 			= [] // String[] id

Config.rules = [ // Object[{String alias, String rule}]
	{
		alias : "example",
		rule : "An example rule"
	}
];

// Help messages
Config.helpMessage 		= ""; // help message
Config.helpMessage_Mod 		= ""; // mod help message

module.exports = Config;
