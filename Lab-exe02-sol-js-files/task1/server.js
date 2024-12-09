const mongoose = require('mongoose');
const uri = 'mongodb+srv://ylliustudy:ylliustudy@cluster0.ss4pkul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const bookingSchema = require('./models/bookings');
const booking = mongoose.model('booking', bookingSchema);
// Way 1 of data coding
// let new_booking = new booking({
// 	title: 'Introduction to Node.JS',
// 	author: 'John Smith',
//    libraries: [{name: 'HKMU',
//             address: 'MC',
//             price: 20,
//             available: true}]
// });
// Way 2 of data coding
let new_booking = new booking({
	title: 'Introduction to Node.JS',
	author: 'John Smith'
});
new_booking.libraries.push({name: 'HKMU',
            address: 'MC',
            price: 20,
            available: true});
// console.log(new_booking);
async function main() {
	await mongoose.connect(uri);
	// console.log('Mongoose Connected!')  
	await new_booking.validate();
    await new_booking.save();
 	const bookings = await booking.find();
    console.log('Current bookings in the MongoDB =>',bookings); 
}  
main()
	.then(console.log('This file is using mongoose to insert a booking document!'))
	.catch((err) => console.log(err))
	.finally()
  
