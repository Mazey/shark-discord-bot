// Made by epsilon#3892
// https://forum.thd.vg/members/16800/

module.exports = function(client) {
	var module = {};

	module.pong = function(channel, mod) {
		if (mod) channel.send('Pong!');
	}

	return module;
}