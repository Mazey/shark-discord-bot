const sql = require("sqlite");
sql.open("./starinfo.sqlite");

module.exports = function(client) {
	const config = require("./stargame.json");
	var module 	= {};

	var is_dropped 	= false;
	var emoji 		= client.emojis.get(config.emoji).toString();
	var channel 	= client.channels.get(config.channel);

	var lastMessage;
	var lastDropMessage;

	var commands = config.commands;
	var currentCommand;

	function starTimer() {
		setInterval(() => {dropStar()}, (((config.delay - config.delay_random) + Math.floor(Math.random() * (2 * config.delay_random))) * 1000 * 60)); // 40-60 minutes
	}

	starTimer();


	function dropStar() {
		if (lastMessage == undefined) return;
		var inactiviy_time = (Date.now() - lastMessage.createdAt)/1000; // in seconds
		if (inactiviy_time > 10) return;

		is_dropped = true;
		currentCommand = commands[Math.floor(Math.random()*commands.length)];
		channel.send(`A ${emoji} has dropped. Grab it, quickly! Say "${currentCommand}".`)
			.then(function(msg){lastDropMessage = msg;});

		setTimeout(function() { 
			if (is_dropped) {
				lastDropMessage.delete();
				is_dropped = false;
			}
		}, config.delete_timer * 1000 * 60); // delete uncaught star after 1 minute
	}


	function awardStar(user, category, amount, donator) {
		amount = (amount == undefined ? 1 : amount);
		sql.get(`SELECT * FROM starinfo WHERE userId ="${user.id}"`).then(row => {
			if (!row) {
				sql.run("INSERT INTO starinfo (userId, stars, gifted, given) VALUES (?, ?, ?, ?)", [user.id, amount, (category == "gift" ? amount : 0), 0]);
			} else {
				sql.run(`UPDATE starinfo SET stars = ${row.stars + amount} WHERE userId = ${user.id}`);
				if (category == "gift") {
					sql.run(`UPDATE starinfo SET gifted = ${row.gifted + amount} WHERE userId = ${user.id}`);
				}
			}
			if (category == "drop") {
				sql.get(`SELECT * FROM starinfo WHERE userId ="${user.id}"`).then(row => {
					channel.send(`${user.toString()} has grabbed a star! Their total star count is ${row.stars}.`);
				});
			}
		}).catch(() => {
			console.error;
			sql.run("CREATE TABLE IF NOT EXISTS starinfo (userId TEXT, stars INTEGER, gifted INTEGER, given INTEGER)").then(() => {
				sql.run("INSERT INTO starinfo (userId, stars, gifted, given) VALUES (?, ?, ?, ?)", [user.id, amount, (category == "gift" ? amount : 0), 0]);
				if (category == "drop") {
					sql.get(`SELECT * FROM starinfo WHERE userId ="${user.id}"`).then(row => {
						channel.send(`${user.toString()} has grabbed a star! Their total star count is ${row.stars}.`);
					});
				}
			});
		});

		if (category == "gift") {
			sql.get(`SELECT * FROM starinfo WHERE userId ="${donator.id}"`).then(row => {
				sql.run(`UPDATE starinfo SET stars = ${row.stars - amount} WHERE userId = ${donator.id}`);
				sql.run(`UPDATE starinfo SET given = ${row.given + amount} WHERE userId = ${donator.id}`);
			});
		}
	}


	function showLeaderboard() {
		var top10_string = "";
		sql.all("SELECT * FROM starinfo ORDER BY stars DESC LIMIT 10").then(async rows => {
			try {
				await rows.forEach(async (r) => {
					let user
					try {
						user = await client.fetchUser(r.userId, true);
					} 
					catch (err) {
						console.log(err);
					}

					if (rows[0] == r) return;
					top10_string += `${user.username}: ${r.stars} star${r.stars > 1 ? "s" : ""} \n`;
				});
			}
			catch (err) {
				console.log(err);
			}

			var embed = {
				"title" : `${emoji} ${client.users.get(rows[0].userId).username}: ${rows[0].stars} stars! ${emoji}`,
				"description" : top10_string,
				"thumbnail": {
					"url": client.users.get(rows[0].userId).avatarURL
				}
			}
			channel.send({embed});
		});
	}
	
	module.onMessage = function(msg) {
		lastMessage = msg;
		if (msg.channel != channel) return;
		if (is_dropped && msg.content == currentCommand)
		{
			awardStar(msg.author, "drop", null);
			is_dropped = false;
		}

		var message = msg.content;
		if (message[0] != "!") return;

		message = message.replace("!", "").split(" ");

		var command = message[0]; message.shift();
		var params = message;

		if (command == "star" && params[0] == "count" && params.length == 1)
		{
			sql.get(`SELECT * FROM starinfo WHERE userId ="${msg.author.id}"`).then(row => {
				if (!row) return msg.reply("you do not have any stars.");
				msg.reply(`you have ${row.stars} stars`);
			});
		}

		if (command == "star" && params[0] == "gift" && params.length == 3)
		{
			var user = msg.mentions.users.first();
			if (user == undefined) return msg.reply("that user does not exist.");
			if (user == msg.author) return msg.reply("jokes on you");
			var amount = parseInt(params[2]);
			if (isNaN(amount) || amount == 0) return msg.reply("that is not an amount I recognise.");

			sql.get(`SELECT * FROM starinfo WHERE userId ="${msg.author.id}"`).then(row => {
				if (!row || row.stars < amount) return msg.reply("you do not have enough stars.");
				awardStar(user, "gift", amount, msg.author);
				msg.channel.send(`${msg.author.toString()} has given ${user.toString()} ${amount} stars!`);
			});
		}

		if (command == "star" && params[0] == "leaderboard" && params.length == 1)
		{
			showLeaderboard();
		}
	}

	return module;
}