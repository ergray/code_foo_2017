var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var Router = require('routes');
var router = Router();
var mysql = require('mysql');

//create connection with user and default database
var connection = mysql.createConnection({
	user: 'root',
	socketPath: '/tmp/mysql.sock',
	database: 'ign_article_video'
});

var insertData = function(request, response, type){
	request.on('data', function(chunk){
		data = ""
		data+= chunk.toString()
		var post;
		var objectified = JSON.parse(data);
		var published = objectified['publishDate'].slice(0, 10);
		var longTitle = objectified['headline'];
		var description =objectified['slug'];
		var ign_url = 'http://www.ign.com/articles/'+published.replace(/-/g, '/')+'/'+description
		var articlePost = {url: ign_url, longTitle: longTitle, description: description}
		var videoPost = {url: objectified['url'], longTitle: objectified['name'], description: objectified['description']}
		if (type=='article'){
			post = articlePost;
		} else if (type=='video'){
			post = videoPost;
		}
		response.end(data, null, function(){
			connection.query('SELECT * FROM '+type+' WHERE url="'+post['url']+'"', function(err, rows, fields){
				if (rows.length>0){
					console.log('found rows ', rows)
					return;
				} else {
					connection.query('INSERT INTO '+type+' SET ?', post, function(err, rows, fields){
						if (!err){
						} else {
							console.log('found an error at', err)
						}
					});					
				}
			});

		})				
	});
};	


//create the server with appropriate routes to services
http.createServer(function(request, response) {
	var uri = url.parse(request.url).pathname
	, filename = path.join(process.cwd(), uri);
	console.log(uri, ' is uri');
	uriSplit = uri.split("/");
	var match = router.match(uri);
	if (match != undefined){
		match.fn(request, response)
		return;
	};	

	//server main page
	if (uri == "/"){
		fs.readFile("./public/main.html", 'utf8', function(err, contents){
			if (err) {
				console.log("error at / readfile")
				response.writeHead(500);
				response.end(err);
				return;
			}
			response.end(contents);
		})
	//server rss file to aggregator	
	} else if (uri=="/content"){
		fs.readFile("./rss/ign.rss", 'utf8', function(err, contents){
			if (err) {
				console.log("error while rssing");
				response.writeHead(500);
				response.end(err);
				return;
			} else {
				response.end(contents)
			}
		})
	//once update RSS is pressed on main page, create an entirely new rss file from database
	//creates both articles and video
	} else if (uri=='/create_rss'){
			var sendDoc = '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">'+
						  '<channel>\n'+
						  '<title>Recent IGN videos and articles</title>\n'+
						  '<link>http://127.0.0.1:5000/content</link>\n'+
						  '<description>Find the latest entertainment news here!</description>'
			var articleStream = '';
			var videoStream = '';

			//nested functionality for asynchronous file creation
			response.end(function(){
				connection.query('SELECT * FROM video ORDER BY id DESC LIMIT 0, 30', function(err, rows){
					if (err){
						console.log(err)
					} else {
						var videoOutput = ''
						for (var row of rows){
						mrssID = row['id'];
						mrssURL = row['url'];
						mrssLongTitle = row['longTitle'];
						mrssDescription = row['longTitle'];
						videoStream+='<item>\n'+
								 '<title>'+mrssLongTitle+'</title>\n'+
								 '<media:content url="'+mrssURL+'" />\n'+
								 '</item>\n'
						}
						connection.query('SELECT * FROM article ORDER BY id DESC LIMIT 0, 30', function(err, rows, fields){
							if (err){
								console.log('error in article', err)
							} else {
								for (var row of rows){
								rssID = row['id'];
								rssURL = row['url'];
								rssLongTitle = row['longtitle'];
								rssDescription = row['description'];
								articleStream+='<item>\n'+
										 '<title>'+rssLongTitle+'</title>\n'+
										 '<link>'+rssURL+'</link>\n'+
										 '</item>\n'
								}
								articleStream = articleStream.replace(/&/g, "&amp;")
								videoStream = videoStream.replace(/&/g, "&amp;")
								fs.writeFileSync('./rss/ign.rss',
									sendDoc+='\n'+videoStream+articleStream+'</channel>\n'+'</rss>', 'utf8')
							}
						});
					}
				});
			})
	//insert functions for both articles and video
	}else if (uri=='/insert/articles'){
		insertData(request, response, 'article');
	}else if (uri=='/insert/videos'){
		insertData(request, response, 'video');
	} 
	else {
		fs.readFile(filename, 'utf8', function(err, contents){
			if (err) {
				console.log(filename);
				console.log("error at secondary readfile")
				response.writeHead(500);
				response.end(err);
				return;
			}
			response.end(contents);
		})
	};
}).listen(process.env.PORT || 5000);