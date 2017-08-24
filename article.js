var request = require('request');
const cheerio = require('cheerio');
var jsonfile = require('jsonfile');

var data = [];
var crawlerArticle = function (article, callback) {
	var id = article.id;
	var url = article.link;
	var title = article.title;
	request(url, function (error, response, body) {
		const $ = cheerio.load(body);
		var html = $('.entry-content.g1-typography-xl').html();
		data.push({
			title: title,
			artile_id: id,
			content: html
		})

		callback();
	});
}

jsonfile.readFile('data.json', function(err, list) {
	var callApi = function () {
		var article = list.shift();
	  	crawlerArticle(article, function () {
	  		if (list.length) {
	  			console.log(list.length);
	  			console.log(article.title);
	  			callApi();
	  		} else {
	  			console.log("End crawler article detail");
	  			jsonfile.writeFile('detail.json', data, function (err) {
				  	console.error(err)
				})
	  		}
	  	})
	}

	callApi();
})