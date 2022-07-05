const express = require('express');
const res = require('express/lib/response');
const { MongoClient } = require('mongodb');
const url = 'mongodb://0.0.0.0:27017';
const client = new MongoClient(url);
const dbName = 'users';
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const port = 3000
app.use(express.static('dist'));
app.get('/getusers', (req, res) =>{
	client.connect();
	const db = client.db(dbName);
	userCollection.find().toArray().then((users)=>{
		res.json(users);
	})
})
app.post('/regform', (req, res) => {
	if(!req.body) return res.status(400).send('Bad Request');
	client.connect();
	const db = client.db(dbName);
	const userCollection = db.collection('user'); 
	const newUser = req.body;
	userCollection.countDocuments({})
	.then((value)=> {
		if (value == 10) {
			userCollection.find({}).limit(10)
			return res.json({message: `К сожалению, мест больше нет`}).end();
		} else {
			userCollection.findOne(
				{surname: newUser.surname,
				name: newUser.name,
				course: newUser.course,
				education: newUser.education,
				rank: newUser.rank,
				special: newUser.special,
				datePractice: newUser.datePractice,
				email: newUser.email,
				phone: newUser.phone,
				direction: newUser.direction,
				skills: newUser.skills
				})
				.then((user) => {
						if(user == null){
						userCollection.insertOne(newUser)
						.then(()=>{
							res.json({error: false, message: `Заявка отправлена!`}).end();
							return
						})
						.catch((err)=> {
							console.log('Insert data to Db', err)
							client.close();
							return
						})	  
						} else
							res.json({error: true , message: 'Такой пользователь уже существует'}).end();
						}).catch((err)=>{
							console.log('error in DB');
							res.status(500).send('server side error');
							client.close();
						})		
		}
	}).catch(()=> {
		console.log('Limit error')
		res.status(403).send('Limit')
		client.close()
		return
	})
})
app.listen(port, () => {
  console.log(`Application listening on port ${port}`)
})