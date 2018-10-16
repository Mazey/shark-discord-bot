// Made by epsilon#3892
// https://forum.thd.vg/members/16800/

const config = require("../config.json");
const request = require("request")

module.exports = function(client) {
	var module = {};

	function deleteResponse(msg) {
		if (+config.find_command.delete_response) {
			setTimeout(() => {
				msg.delete().catch(() => {});
			}, config.find_command.delete_response * 1000);
		}
	}

	module.onCommand = async function(msg, cmd) {
		if (config.find_command.delete_command) {
			// Delete command message
			msg.delete();
		}

		// Get username
		let username = cmd.params[0];
		if (!username) {
			let message = await msg.channel.send('Please specify a KAG username');
			deleteResponse(message);
			return;
		}

		// Send initial message
		let message = await msg.channel.send('Finding user...');

		// Get KAG server data
		request({
			url: `https://api.kag2d.com/v1/game/thd/kag/servers?filters=[{"field":"current","op":"eq","value":"true"},{"field":"connectable","op":"eq","value":true},{"field":"currentPlayers","op":"gt","value":"0"}]`,
			json: true
		}, (error, response, body) => {
			if (error) {
				// Unable to retrieve KAG servers
				message.edit('Unable to retrieve KAG servers. Please try again later').catch(() => {});
				deleteResponse(message);
				return;
			}

			// Find if player is on a server
			let servers = body.serverList;
			for (server of servers) {
				let player = server.playerList.find(x => x.toUpperCase() === username.toUpperCase());

				if (player) {
					let url = '';
					if (config.find_command.server_link && !server.password) {
						url = `\n<https://furai.pl/joingame/kag/${server.IPv4Address}/${server.port}>`;
					}

					let playerCount = '';
					if (config.find_command.player_count) {
						playerCount = ` (${server.currentPlayers}/${server.maxPlayers})`;
					}

					// User is on a server
					message.edit(`**${player}** is on **${server.name}**${playerCount}${url}`).catch(() => {});
					deleteResponse(message);
					return
				}
			}

			// Get user data
			request({
				url: `https://api.kag2d.com/v1/player/${username}`,
				json: true
			}, (error, response, body) => {
				if (error) {
					// It shouldn't run this code but it's here this just in case
					message.edit(`There was an issue finding **${username}**. Please try again later`);
					deleteResponse(message);
					return
				}

				if (body.statusCode === 404) {
					// User doesn't exist
					message.edit(`**${username}** doesn't exist`).catch(() => {});
					deleteResponse(message);
					return
				}

				// Replace username with properly capitalized one
				username = body.playerInfo.username;

				// User isn't on a server
				message.edit(`**${username}** isn't on a server`).catch(() => {});
				deleteResponse(message);
				return;
			});
		});
	}

	return module;
}