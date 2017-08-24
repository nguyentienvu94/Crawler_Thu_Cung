var lzString = require('lz-string');
var jsonfile = require('jsonfile');

jsonfile.readFile('all.json', function(err, list) {
	for (var i = 0; i < list.length; i++) {
		var content = list[i].content;
		content = lzString.compress(content);
		list[i].content = content;
	}

	jsonfile.writeFile('all1.json', list, function (err) {
	  	console.error(err)
	})
})