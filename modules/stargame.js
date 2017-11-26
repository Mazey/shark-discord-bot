module.exports = function(client) {
	var Config = require("./../config.js");
	var dropped = false;
	var channel = client.channels.get(Config.offtopic_channel);

	function dropStar() {
		channel.fetchMessage(channel.lastMessageID).then((_msg) => {
			if (Date.now() - _msg.createdAt < 120 * 1000 && !dropped) { // only drop star if there is no star dropped already and #off_topic has had activity the past 2 minutes
				dropped = true;
				channel.send("A " + client.emojis.get("352467105419100161").toString() + " has dropped. Grab it up, quickly! Write !grab star");
			}

		});
	}


	client.on('message', (msg) => {
		if (dropped && msg.channel == channel && msg.content == Config.prefix + "grab star") {
			dropped = false;
			channel.send(msg.member.toString() + " takes the cake! Their total star count is 123.");
		}
	});

	client.setInterval(dropStar, (Math.random() * (40 - 20) + 20) * 60 * 1000); // drop star every 20-40 minutes
}