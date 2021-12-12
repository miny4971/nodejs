const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb+srv://miny4971:somin1121!@cluster0.gj6zq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

// server와 browser가 연결될때까지 기다리는 것
app.listen(3000, function() {
	console.log('listening on 3000')
})

//crud handlers

MongoClient.connect(url, {
        useUnifiedTopology: true
} , function(err, database) {
        if(err) {
                console.error("MongoDB 연결 실패", err);
                return;
        }
        console.log("Connected to Database")
        const db = database.db('myFirstDatabase')
		const quotesCollection = db.collection('quotes')
        // app.use , app.get , app.post, app.listen 사용해서 db작업!
		app.set('view engine', 'ejs');

		// body-parser
		app.use(bodyParser.urlencoded({ extended: true }));
		app.post('/quotes', (req, res) => {
			quotesCollection.insertOne(req.body)
			.then(result => {
				res.redirect('/')
			})
			.catch(error => console.error(error))
		});

		// sendFile method를 통해 index.html파일로 연결하자
		app.get('/', (req, res) => {
			// res.sendFile(__dirname + '/index.html')
			const cursor = db.collection('quotes').find().toArray()
			.then(results => {
					res.render('index.ejs', { quotes: results })
		})
			.catch(error => console.error(error))

		})
});




