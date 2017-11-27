var fs = require('fs');

module.exports = function(client) {
	var Config = require("./../config.js");
	var dropped = false;
	var channel = client.channels.get(Config.offtopic_channel);

	function dropStar() {
		channel.fetchMessage(channel.lastMessageID).then((_msg) => {
			if (Date.now() - _msg.createdAt < 120 * 1000 && !dropped) { // only drop star if there is no star dropped already and #off_topic has had activity the past 2 minutes
				dropped = true;
				channel.send("A " + client.emojis.get("352467105419100161").toString() + " has dropped. Grab it, quickly! Write !grab star");
			}

		});
	}


	client.on('message', (msg) => {
		if (!msg.channel == channel) return;
		if (msg.content == Config.prefix + "star leaderboard") {
			var abuser = false;
			Config.abusers.forEach((userid) => {
				if (msg.member.id == userid)
					abuser = true;
			});

			if (abuser) {
				msg.delete();
				console.log("Denied " + msg.member.id + " the leaderboard command because they are in the abuser list.");
				return;
			}

			fs.exists('data.json', function(exists) {
				if (!exists) return;
				fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
					if (err) throw err;
					else {
						var top10 = JSON.parse(data).sort(function(a, b) {
						    return parseFloat(b.stars) - parseFloat(a.stars);
						}).slice(0,10);

						var top10_string = "";

						for (var i = 0; i < top10.length; i++) {
							top10_string += client.users.get(top10[i].userid).username + ": " + top10[i].stars + "\n";
						}
						var emoji = client.emojis.get("352467105419100161").toString();
						channel.send(emoji + "```" + top10_string + "```" + emoji);
					}
				});
			});

			return;
		}

		if (dropped && msg.content == Config.prefix + "grab star") {
			var abuser = false;
			Config.abusers.forEach((userid) => {
				if (msg.member.id == userid)
					abuser = true;
			});

			if (abuser) {
				msg.delete();
				console.log("Denied " + msg.member.id + " a star because they are on the abuser list.");
				return;
			}

			fs.exists('data.json', function(exists) {
				if (!exists) {
					var data = [{
						userid : msg.member.id,
						stars : 0
					}];

					data[0].stars++;

					channel.send(msg.member.toString() + " takes the cake! They have just earned the first star on this server.");

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

							if (winner == undefined) {
								winner = data.length;
								data[winner] = {
									userid : msg.member.id,
									stars : 0
								}
							}

							data[winner].stars++;

							fs.writeFile('data.json', JSON.stringify(data), 'utf8', function(err){
								if (err) throw err;
							});

							channel.send(msg.member.toString() + " takes the cake! Their total star count is " + data[winner].stars + ".");
						}
					});
				}
			});

			dropped = false;
		}
	});

	client.setInterval(dropStar, (Math.random() * (40 - 20) + 20) * 60 * 1000); // drop star every 20-40 minutes
}