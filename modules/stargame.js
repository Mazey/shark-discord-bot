var fs = require('fs');

module.exports = function(client) {
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

				dropTimer(false);
			}
			else {
				activeChat = false;
			}
		}
	}

	function dropTimer(shorttimer) {
		var _minutes = shortimer ? (20 - 5) + 5 : (45 - 15) + 15;
		client.setTimeout(dropStar, (Math.random() * _minutes * 60 * 1000);
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

	function giveStar(userid) {
		readData(function (err, data) {
			var data = JSON.parse(data);
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

			if (!fakeDrop) {
				data[winner].stars++;

				fs.writeFile('data.json', JSON.stringify(data), 'utf8', function(err){
					if (err) throw err;
				});

				channel.send(msg.member.toString() + " takes the cake! Their total star count is " + data[winner].stars + ".");
			}
			else {
				if (data[winner].stars > 0) {
					return;
				}
				else {
					data[winner].stars--;
					data[0].stars++;

					fs.writeFile('data.json', JSON.stringify(data), 'utf8', function(err){
						if (err) throw err;
					});

					channel.send(msg.member.toString() + " has given me one of their stars, how kind! My total star count is " + data[0].stars + ".");
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
				else if (dropped) giveStar(msg.member.id);
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
	});

	dropTimer(false);

	return module;
}