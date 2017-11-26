module.exports = function(client) {
	var Config = require("./../config.js");
	var dropped = false;

	function dropStar() {
		var channel = client.channels.get(Config.offtopic_channel);
		if (dropped || Date.now() - channel.fetchMessage(channel.lastMessageID).createdAt > 60 * 1000) return;

			dropped = true;
	}

	client.setInterval(dropStar, (Math.random() * (45 - 15) + 15) * 60 * 1000);
}