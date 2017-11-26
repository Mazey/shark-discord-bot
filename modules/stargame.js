var fs = require('fs');

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

			fs.exists('data.json', function(exists) {
				if (!exists) {
					var data = [{
						userid : msg.member.id,
						stars : 0
					}];

					data[0].stars++;

					channel.send(msg.member.toString() + " takes the cake! They have just earned their first star");

					fs.writeFile('data.json', JSON.stringify(data), 'utf8', function(err){
						if (err) throw err;
					});
				}
				else {
					fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
						if (err) throw err;
						else {
							data = JSON.parse(data);

							var winner;

							for (var i = 0; i < data.length; i++) {
								if (data[i].userid == msg.member.id) {
									winner = i;
									break;
								}
							}
								console.log("one : " + winner)
							if (winner == undefined) {
								winner = data.length;
								data[winner] = {
									userid : msg.member.id,
									stars : 0
								}
							}
								console.log("two : " + winner)

							data[winner].stars++;

								console.log(data[winner]);

							fs.writeFile('data.json', JSON.stringify(data), 'utf8', function(err){
								if (err) throw err;
							});

							channel.send(msg.member.toString() + " takes the cake! Their total star count is " + data[winner].stars);
						}
					});
				}
			});

			dropped = false;
		}
	});

	client.setInterval(dropStar, (Math.random() * (40 - 20) + 20) * 60 * 1000); // drop star every 20-40 minutes
}