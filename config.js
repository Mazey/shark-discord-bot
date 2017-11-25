var Config = {};

	Config.key = "";
	Config.prefix = "!";
	Config.modroles = ["Moderator", "Administrator"];

	Config.joinableRoles = {
		openRoles : ["Captaineer"],
		locationRoles : ["EU", "OC", "NA", "SA", "AN", "AF", "AS"]
	};

	Config.matchmaking_channel = "339006421721153537";
	Config.welcome_channel = "361184531186712576";

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

module.exports = Config;