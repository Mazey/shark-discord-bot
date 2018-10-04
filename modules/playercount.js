var config = require("../config.json");
var url = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=${config.steam_api_key}&format=json&appid=219830`;
var request = require("request")

module.exports = function(client) {
	var module = {};

	module.updatePlayerCount = function() {
		request({
		    url: url,
		    json: true
		}, function (error, response, body) {

		    if (!error && response.statusCode === 200) {
				client.user.setGame('with ' + body.response.player_count + ' fishies');
		    }
		});
	}
	return module;
}