var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(express.static(__dirname + '/../angular-client'));
app.use(express.static(__dirname + '/../node_modules'));
app.use(bodyParser.json({
    extended: true
}));


app.get('/log', function(req, res) {
	
});

app.post('/', function(req, res) {
	console.log('recieved')
});

app.listen(3000, function() {
  console.log('In space no one can hear you scream');
});