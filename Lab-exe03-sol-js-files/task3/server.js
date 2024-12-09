var express             = require('express'),
    app                 = express(),
	{ MongoClient, ServerApiVersion } = require("mongodb"),	
	formidable 			= require('express-formidable'),
	//formidable can handle the file in the request data, it is an advanced version of body-parser
	fsPromises 			= require('fs').promises;

app.use(formidable());

/*MongoDB settings*/
const mongourl = 'mongodb+srv://ylliustudy:ylliustudy@cluster0.ss4pkul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const dbName = 'test';
const collectionName = "bookings";
const client = new MongoClient(mongourl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const insertDocument = async (db, doc) => {
    var collection = db.collection(collectionName);
    let results = await collection.insertOne(doc);
	console.log("insert one document:" + JSON.stringify(results));
    return results;
}

const findDocument = async (db, criteria) => {
    var collection = db.collection(collectionName);
    let results = await collection.find(criteria).toArray();
	console.log("find the documents:" + JSON.stringify(results));
    return results;
}
const updateDocument = async (db, criteria, updateData) => {
    var collection = db.collection(collectionName);
    let results = await collection.updateOne(criteria, { $set: updateData });
	console.log("update one document:" + JSON.stringify(results));
    return results;
}
const deleteDocument = async (db, criteria) => {
    var collection = db.collection(collectionName);
    let results = await collection.deleteMany(criteria);
	console.log("delete one document:" + JSON.stringify(results));
    return results;
}
/*End of MongoDB settings*/

/* RESTful */
app.post('/api/booking/:bookingid', async (req,res) => { //async programming way
    if (req.params.bookingid) {
        console.log(req.body)
		await client.connect();
		console.log("Connected successfully to server");
	    const db = client.db(dbName);
	    let newDoc = {
	        bookingid: req.fields.bookingid,
	        mobile: req.fields.mobile};
	    if (req.files.filetoupload && req.files.filetoupload.size > 0) {
	        const data = await fsPromises.readFile(req.files.filetoupload.path);
	        newDoc.photo = Buffer.from(data).toString('base64');}
		await insertDocument(db, newDoc);
	    res.status(200).json({"Successfully inserted":newDoc}).end();
    } else {
        res.status(500).json({"error": "missing bookingid"});
    }
})
// curl -X POST -H "Content-Type: application/json" --data '{"bookingid":"BK999","mobile":"00000000"}' localhost:8099/api/booking/BK999
// curl -X POST -F 'bookingid=test01' -F "bookingid=test01" -F "mobile=00000003" -F "filetoupload=@/home/developer/Pictures/robot.jpeg" localhost:8099/api/booking/test01

app.get('/api/booking/:bookingid', async (req,res) => { //async programming way
	if (req.params.bookingid) {
		console.log(req.body)
        let criteria = {};
        criteria['bookingid'] = req.params.bookingid;
		await client.connect();
	    console.log("Connected successfully to server");
		const db = client.db(dbName);
		const docs = await findDocument(db, criteria);
	    res.status(200).json(docs);
	} else {
        res.status(500).json({"error": "missing bookingid"}).end();
    }
});
// curl -X GET http://localhost:8099/api/booking/BK999

app.put('/api/booking/:bookingid', async (req,res) => {
    if (req.params.bookingid) {
        console.log(req.body)
		let criteria = {};
        criteria['bookingid'] = req.params.bookingid;
			await client.connect();
			console.log("Connected successfully to server");
		    const db = client.db(dbName);
		    let updateData = {
		        bookingid: req.fields.bookingid || req.params.bookingid,
		        mobile: req.fields.mobile,
		    };
		    if (req.files.filetoupload && req.files.filetoupload.size > 0) {
		        const data = await fsPromises.readFile(req.files.filetoupload.path);
		        updateData.photo = Buffer.from(data).toString('base64');
		    }
		    const results = await updateDocument(db, criteria, updateData);
		    res.status(200).json(results).end();
    } else {
        res.status(500).json({"error": "missing bookingid"});
    }
})
// curl -X PUT -H "Content-Type: application/json" --data '{"mobile":"88888888"}' localhost:8099/api/booking/BK999
// curl -X PUT -F "mobile=00000061" localhost:8099/api/booking/test01

app.delete('/api/booking/:bookingid', async (req,res) => {
    if (req.params.bookingid) {
		console.log(req.body)
		let criteria = {};
        criteria['bookingid'] = req.params.bookingid;
		await client.connect();
		console.log("Connected successfully to server");
	    const db = client.db(dbName);
	    const results = await deleteDocument(db, criteria);
        console.log(results)
	    res.status(200).json(results).end();
    } else {
        res.status(500).json({"error": "missing bookingid"});       
    }
})
// curl -X DELETE localhost:8099/api/booking/test06s

/* End of Restful */

app.get('/*', (req,res) => {
    res.status(404).render('info', {message: `${req.path} - Unknown request!` });
})

const port = process.env.PORT || 8099;
app.listen(port, () => {console.log(`Listening at http://localhost:${port}`);});
