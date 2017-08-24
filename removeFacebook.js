var jsonfile = require('jsonfile');
var cheerio = require('cheerio');

jsonfile.readFile('detail.json', function(err, list) {
	for (var i = 0; i < list.length; i++) {
		var content = list[i].content;
		if (content) {
			var $ = cheerio.load(content);
			if ($('.fb-comments').length) {
				$('.fb-comments').remove();
			}

			list[i].content = $.html();	
		}
	}

	jsonfile.writeFile('all.json', list, function (err) {
	  	console.error(err)
	})
})