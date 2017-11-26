var fs = require('fs');
var data;

module.exports = {
	readData : function() {
		fs.exists('data.json', function(exists) {
			if (!exists) {
				data = [];
				fs.writeFile('data.json', JSON.stringify(data);, 'utf8', callback);
			}
			else {
				fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
					if (err) {
					    console.log(err);
					} 
					else {
						global.data = JSON.parse(data);
					}
				});
			}
		});
		return data;
	},

	writeData : function() {
		fs.writeFile('data.json', JSON.stringify(data);, 'utf8', callback);
	},

	updateData : function(newdata) {
		data = newdata;
		writeData();
	}
}