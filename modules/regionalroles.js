var config = require("../config.json");

module.exports = function() {
	var module = {};

	function doRole(member, name) {
		var role_name = config.regional_roles[config.regional_roles.join("\u200b").toLowerCase().split("\u200b").indexOf(name.toLowerCase())];
		if (role_name == undefined) return false; // non-existent

		var role = member.guild.roles.find("name", role_name); // if this returns null there is an issue in config

		var has_role = member.roles.has(role.id);

		if (!has_role) {
			member.addRole(role);

			config.regional_roles.forEach((r) => { // remove any regional role user may have
				if (r == role_name) return;

				var _role = member.guild.roles.find("name", r);
				if (member.roles.has(_role.id)) { 
					member.removeRole(_role);
				}
			});
		}
		else {
			member.removeRole(role);
		}

		return true;
	}

	module.onCommand = function(msg, cmd) {
		var role_name = cmd.params.join(" ");

		if (doRole(msg.member, role_name)) {
			msg.delete();
		}
	}

	return module;
}