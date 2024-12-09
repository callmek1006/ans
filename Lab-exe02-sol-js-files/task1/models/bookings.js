var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({
	id: mongoose.Schema.ObjectId,
	isbn: String,
	title: {type:String,required: true},
	author: {type:String,required: true},
   libraries: [{name: String,
            address: {type: String,	
			enum: ['MC','JCC','IOH']},
            price: {type: Number, min: 10, max: 100},
            available: Boolean}]
});

module.exports = bookingSchema;
