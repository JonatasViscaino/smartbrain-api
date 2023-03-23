const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false},
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
  }
});

const PORT = process.env.PORT || 3000

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();
const saltRounds= 10;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('sucess');
});

app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, saltRounds) });
app.get('/profile/:id', (req,res) => { profile.handleProfileGet(req, res, db) });
app.put('/image', (req,res) => { image.handleImage(req, res, db) } );
app.post('/imageurl', (req,res) => {image.handleApiCall(req,res)}) 

app.listen(PORT, () => {
	console.log('Server listening on: ' + PORT);
});