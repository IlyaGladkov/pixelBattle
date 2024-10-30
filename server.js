const fs = require('fs')

var express = require('express');
var app = express();

var expressWs = require('express-ws')(app);

app.use(function (req, res, next) {
	req.testing = 'testing';
	return next();
});

app.use(express.static('public'))

app.get('/', async function (req, res, next) {
	console.log('get route', req.testing);
	try {
		let data = await fs.promises.readFile('index.html', 'utf8')
		res.send(data)
	} catch (err) {
		console.log('что-то пошло не так')
	}
	res.end();
});

app.ws('/', function (ws, req) {
	ws.on('message', function (msg) {
		ws.send('hello')
		console.log(msg);
	});
	console.log('socket', req.testing);
});

app.listen(3000);