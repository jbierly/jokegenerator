var restify = require('restify');

var google 		= require('googleapis');
var searchAPI 	= google.customsearch('v1');
var jokes 		= require("./jokes");

function getJokeImage(req, res, next) {
	
	var requestParams = {
		'cx'			: '007308418438680453078:-on4heh66ga',
		'key'			: 'AIzaSyAfEkrPdxrjo1ZZWljJjduS-8mqFK_6saw',
		'searchType' 	: 'image',
		'safe'			: 'high',
		'num'			: 1,
		'q'				: req.params.query
	};
	
	searchAPI.cse.list(requestParams, function(err, resp) {
	  if (err) {
	    console.log('Custom Search Error: ', err);
	    return;
	  }	  
	  if (resp.items && resp.items.length > 0) {
		  res.send(resp.items[0].link);
		  next();
	  }
	});	
}

function getRandomJoke(req, res, next){
	var item = Math.floor(Math.random()*jokes.length);
	res.send(jokes[item], {'content-type': 'application/json; charset=utf-8'});
	next();
}

var server = restify.createServer();
//setup cors
restify.CORS.ALLOW_HEADERS.push('accept');
restify.CORS.ALLOW_HEADERS.push('sid');
restify.CORS.ALLOW_HEADERS.push('lang');
restify.CORS.ALLOW_HEADERS.push('origin');
restify.CORS.ALLOW_HEADERS.push('withcredentials');
restify.CORS.ALLOW_HEADERS.push('x-requested-with');
server.use(restify.CORS());
server.get('/getJokeImage/:query', getJokeImage);
server.head('/getJokeImage/:query', getJokeImage);

server.get('/getRandomJoke', getRandomJoke);
server.head('/getRandomJoke', getRandomJoke);

var port = process.env.PORT || 8080;
server.listen(port, function() {
	console.log('%s listening at %s', server.name, server.url);
});