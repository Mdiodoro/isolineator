var mongoose = require('mongoose');

var mongoURI = 'mongodb://localhost/isodb';
mongoose.connect(mongoURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console,'There is an error in db connection'));
db.on('open', function () {
	console.log('MongoDB connection is now open');
});

module.exports.db = db;