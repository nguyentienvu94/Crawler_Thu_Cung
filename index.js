var request = require('request');
const cheerio = require('cheerio');
var jsonfile = require('jsonfile');
const download = require('image-downloader');

var data = [];

var crawlerData = function (page) {
	request('https://www.bacsithuy.org/page/' + page, function (error, response, body) {
		const $ = cheerio.load(body);
		var continueCrawler = true;
		var listArticle = $(".g1-collection-item.g1-collection-item-1of3");
		for (var i = 0; i < listArticle.length; i++) {
			var article = $(listArticle[i]);
			var title = article.find('.entry-header .g1-gamma-1st a');
			var link = title.attr('href');
			title = title.text();

			var img = article.find('.g1-frame-inner img');
			img = img.attr('src');

			if (checkExistTitle(title)) {
				continueCrawler = false;
				break;
			} else {
				data.push({
					id: i + (page - 1) * listArticle.length,
					title: title,
					link: link,
					img: img
				})
			}

			downloadImage(i, img, page, listArticle.length);
		}

		if (continueCrawler) {
			crawlerData(++ page);
			console.log(page);
		} else {
			jsonfile.writeFile('data.json', data, function (err) {
			  	console.error(err)
			})
			console.log("End crawler data");
		}
	});
}

crawlerData(1);

var checkExistTitle = function (title) {
	for (var i = 0; i < data.length; i++) {
		if (data[i].title == title)
			return true;
	}

	return false;
}

var downloadImage = function (index, url, page, size) {
	const options = {
	  	url: url,
	  	dest: 'imgs/' + (index + (page - 1) * size) + '.jpg'
	}
		 
	download.image(options).then(({ filename, image }) => {
	    console.log('File saved to', filename)
	}).catch((err) => {
	    throw err
	})
}