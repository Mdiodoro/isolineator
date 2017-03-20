var mongoose = require('mongoose');

var inputsSchema = mongoose.Schema({
	//id: Number, no need for id as mongoose auto creates _id for each schema
	vtext: String,
	topic: String,
	createdAt: Date
});

var Inputs = mongoose.model('inputs', inputsSchema);

var input1 = new Inputs({
	vtext: 'hi there',
	topic: 'hi',
	createdAt: new Date()
});

input1.save(function (err, newInput) {
	if (err) {
		console.log('error in input1 save : ', err);
	} else {
		console.log('input 1 now inserted: ', newInput);
	}
});


var input2 = new Inputs({
	vtext: 'go away',
	topic: 'grumpy',
	createdAt: new Date()
});

input2.save(function (err, newInput) {
	if (err) {
		console.log('error in input2 save : ', err);
	} else {
		console.log('input 2 now inserted: ', newInput);
	}
});

module.exports.Inputs = Inputs;