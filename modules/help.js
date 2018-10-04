var Help = {};

var config = require("../config.json");

help_message = `
**Help**
**Commands:**
`+'```'+`
!role <role> 	- Add or remove a role

	Open roles: ${config.open_roles.join(', ')}
		Example: !role ${config.open_roles[0]}

	Continental roles (you are limited to one): ${config.regional_roles.join(', ')}
		Example: !role ${config.regional_roles[0]}

!help 		   - Sends you this dialog
`+'```';

help_mod = `
**Additional moderator help**
**Commands:**
`+'```'+`
!rule <rule> <user>	- Make the bot say a rule, and optionally tag a user
					   - Rule can be a rule number or a pre-defined alias (or part of an alias)
	
	Rules: ${config.rules.join(", ")}
		Example: 
				- !rule 4
				- !rule pg13 @johnny98
				- !rule softsk
`+'```';

Help.send = function(user, is_mod) {
	user.send(help_message);
	if (is_mod) user.send(help_mod);
}


module.exports = Help;