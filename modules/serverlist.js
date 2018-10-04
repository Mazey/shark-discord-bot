// Made by epsilon#3892
// https://forum.thd.vg/members/16800/

var config = require("../config.json");
var request = require("request")

module.exports = function(client) {
	var module = {};

	var channel, message;
	channel = client.channels.get(config.server_list.channel);
	if (!channel) return;
	channel.fetchMessage(config.server_list.message).then(msg => {
		message = msg;
		loop();
	}).catch(err => {
		return; // Don't do anything if the message doesn't exist
	});

	function loop() {
		request({
		    url: 'https://api.kag2d.com/v1/game/thd/kag/servers?filters=[{"field":"current","op":"eq","value":"true"},{"field":"connectable","op":"eq","value":true},{"field":"currentPlayers","op":"gt","value":"0"}]',
		    json: true
		}, function (error, response, body) {
			if (error) return;

			let servers = body.serverList;

			// Sort servers and players
			servers = servers.sort((a, b) => {
				if (a.currentPlayers === b.currentPlayers) {
					return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
				}
				return b.currentPlayers - a.currentPlayers;
			});
			servers.forEach(server => {
				server.playerList.sort((a, b) => {
					return a.toUpperCase().localeCompare(b.toUpperCase());
				});
			});

			// Make message content
			let players = servers.reduce((t, x) => t + x.currentPlayers, 0);
			let text = '```md\n' + `# Server list - ${servers.length} ${plural(servers.length, 'server')}, ${players} ${plural(players, 'player')}` + '``````diff\n';
			text += servers.map(server => {
				let prefix = (/(?=^KAG Official \w+ (AUS|AU|EU|US|USA)\b)|(?=^Official Modded Server (AUS|AU|EU|US|USA)\b)/g.test(server.name)) ? '-' : '+';
				let full = (server.playerPercentage >= 1) ? ' [FULL]' : '';
				let specs = (server.spectatorPlayers > 0) ? ` (${server.spectatorPlayers} spec)` : '';
				return `${prefix} ${alignText(server.name, 50, -1)} ${alignText(server.currentPlayers, 3, 1)}/${server.maxPlayers}${full}${specs}\n​${server.playerList.join('  ')}`;
			}).join('\n\n') + '\n```';

			// Update message, channel and presence
			channel.setName(`${servers.length}-${plural(servers.length, 'server')}_${players}-${plural(players, 'player')}`);
			client.user.setPresence({ status: 'online', game: { name: `with ${players} ${plural(players, 'fishy', 'ies', 1)}` } });
			message.edit(text).catch(console.error);
		});

		// Loop on an interval
		let interval = config.server_list.interval * 1000;
		let delay = interval - new Date() % interval;
		setTimeout(module.loop, delay);
	}

	// Aligns text to the left, right or center
	function alignText(text, width, align, padChar = ' ') {
		text = text.toString();
		if (text.length > width) return text.substr(0, width - 1) + '…';
		width -= text.length;
		if (align < 0) return text + padChar.repeat(width);
		if (align > 0) return padChar.repeat(width) + text;
		width /= 2;
		return padChar.repeat(Math.floor(width)) + text + padChar.repeat(Math.ceil(width));
	}

	// Pluralizes the word
	function plural(val, text, suffix = 's', trim = 0) {
		return val === 1 ? text : text.substring(0, text.length - trim) + suffix;
	}

	return module;
}