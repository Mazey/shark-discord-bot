var fs = require('fs');

module.exports = function(client) {
<<<<<<< HEAD
	var Config = require("./../config.js");
	var module = {}
	var dropped = false;
	var channel = client.channels.get(Config.offtopic_channel);
	var grab_commands = [Config.prefix + "grab star", Config.prefix + "take star", Config.prefix + "grab", Config.prefix + "star", "that's my star", "I grab star"];
	var current_command;
=======
	var Config 	= require("./../config.js");
	var module 	= {};
	var channel = client.channels.get(Config.offtopic_channel);
	var emoji 	= client.emojis.get("352467105419100161").toString();

	var _pfx 					= Config.prefix;
	var dropCommandsPositive 	= [_pfx + "grab", _pfx + "grab star", "that's my star", "I grab star"];
	var dropCommands 			= [_pfx + "star", _pfx + "take star"];
	var dropCommandsNegative 	= [_pfx + "give star", _pfx + "give"];

	var dropped 			= false;
	var activeChat 			= true;
	var dropCommandCurrent;
	var fakeDrop;
>>>>>>> star-minigame

	function dropStar() {
		channel.fetchMessage(channel.lastMessageID).then((lastmsg) => {
			var secondsAgo = (Date.now() - lastmsg.createdAt)/1000;

			if (secondsAgo < 45) {
				fakeDrop = Math.random() * 100 > 85;
				var _commands = dropCommands.concat((fakeDrop ? dropCommandsNegative : dropCommandsPositive));
				dropCommandCurrent = _commands[Math.floor(Math.random() * _commands.length)];

				if (!fakeDrop) {
					channel.send("A " + emoji + ' has dropped. Grab it, quickly! Say "' + dropCommandCurrent + '".').then((msg) => {
						setTimeout(function(){
							if (dropped) { msg.delete(); dropped = false; };
						},2 * 60 * 1000);
					});
				}
				else {
					channel.send("A " + emoji + " hasn't dropped. Give yours to Shark, quickly! Say " + '"' + dropCommandCurrent + '".').then((msg) => {
						setTimeout(function(){
							if (dropped) { msg.delete(); dropped = false; };
						},2 * 60 * 1000);
					});
				}

				dropped = true;
<<<<<<< HEAD
				current_command = grab_commands[Math.floor(Math.random() * grab_commands.length)];
				channel.send("A " + client.emojis.get("352467105419100161").toString() + ' has dropped. Grab it, quickly! Say "' + current_command + '".');
=======

				dropTimer(false);
>>>>>>> star-minigame
			}
			else {
				activeChat = false;
			}
		});
	}

	function dropTimer(shorttimer) {
		var _minutes = shorttimer ? (20 - 5) + 5 : (45 - 15) + 15;
		client.setTimeout(dropStar, (Math.random() * _minutes * 60 * 1000));
	}

	function readData(callback) {
	    fs.readFile("./data.json", function (err, data) {
	        if (err) return callback(err)
	        callback(null, data)
	    })
	}

	function showLeaderboard() {
		readData(function (err, data) {
			if (err) throw err;
			else {
				var top10 = JSON.parse(data).sort(function(a, b) {
				    return parseFloat(b.stars) - parseFloat(a.stars);
				}).slice(0,10);

				var top10_string = "";

				for (var i = 1; i < top10.length; i++) {
					top10_string += client.users.get(top10[i].userid).username + ": " + top10[i].stars + " star" + (top10[i].stars > 1 ? "s" : "") + "\n";
				}

				var top1 = client.users.get(top10[0].userid);
				var embed = {
					"title" : (emoji + " " + top1.username + ": " + top10[0].stars + " stars! " + emoji),
					"description" : top10_string,
				    "thumbnail": {
				      "url": top1.avatarURL
				    }
				}

				channel.send({embed});
			}
		});
	}

	function giveStar(member) {
		readData(function (err, data) {
			var data = JSON.parse(data);
			var winner;

<<<<<<< HEAD
	module.onMessage = function(msg) {
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

						for (var i = 1; i < top10.length; i++) {
							top10_string += client.users.get(top10[i].userid).username + ": " + top10[i].stars + " star" + (top10[i].stars > 1 ? "s" : "") + "\n";
						}

						var emoji = client.emojis.get("352467105419100161").toString();
						var top1 = client.users.get(top10[0].userid);
						var embed = {
							"title" : (emoji + " " + top1.username + ": " + top10[0].stars + " stars! " + emoji),
							"description" : top10_string,
						    "thumbnail": {
						      "url": top1.avatarURL
						    }
						}

						channel.send({embed});
					}
				});
			});

			return;
		}

		if (dropped && msg.content == current_command) {
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
=======
			for (var i = 0; i < data.length; i++) {
				if (data[i].userid == member.id) {
					winner = i;
					break;
				}
			}
>>>>>>> star-minigame

			if (winner == undefined) {
				winner = data.length;
				data[winner] = {
					userid : member.id,
					stars : 0
				}
			}

<<<<<<< HEAD
					channel.send(msg.member.toString() + " takes the cake! They have just earned the first star on this server.");
=======
			if (!fakeDrop) {
				data[winner].stars++;

				fs.writeFile('data.json', JSON.stringify(data), 'utf8', function(err){
					if (err) throw err;
				});

				channel.send(member.toString() + " takes the cake! Their total star count is " + data[winner].stars + ".");
			}
			else {
				if (data[winner].stars > 0) {
					data[winner].stars--;
					data[0].stars++;
>>>>>>> star-minigame

					fs.writeFile('data.json', JSON.stringify(data), 'utf8', function(err){
						if (err) throw err;
					});

					channel.send(member.toString() + " has given me one of their stars, how kind! My total star count is " + data[0].stars + ".");
				}
			}

		});

		dropped = false;
	}


	module.onMessage = function(msg) {
		if (msg.channel != channel) return;

		if (!activeChat) {
			activeChat = true;
			dropTimer(true);
		}

		var abuser = false;
		Config.abusers.forEach((userid) => {
			if (msg.member.id == userid) abuser = true;
		});

		switch (msg.content) {
			case _pfx + "star leaderboard":
				if (abuser) msg.delete();
				else showLeaderboard();
				break;
			case dropCommandCurrent:
				if (abuser) msg.delete();
				else if (dropped) giveStar(msg.member);
				break;
		}

	}

	fs.exists('data.json', function(exists) {
		if (!exists) {
			var data = [{
				userid : client.user.id,
				stars : 0
			}];

			fs.writeFile('data.json', JSON.stringify(data), 'utf8', function(err){
				if (err) throw err;
			});
		}
	};

<<<<<<< HEAD
	client.setInterval(dropStar, (Math.random() * (40 - 20) + 20) * 60 * 1000); // drop star every 20-40 minutes
=======
	dropTimer(false);
>>>>>>> star-minigame

	return module;
}