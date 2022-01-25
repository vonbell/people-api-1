// dependencies
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

// initialize the express app
const app = express();

// configuring server settings
require('dotenv').config();

// expose our config variables
const { MONGODB_URL, PORT = 4000 } = process.env;

// connect to mongoDB
mongoose.connect(MONGODB_URL);

// set up our mongoDB event listeners
const db = mongoose.connection;

db
.on('connected', () => console.log('Connected to MongoDB'))
.on('disconnected', () => console.log('Disconnected from MongoDB'))
.on('error', (err) => console.log('MongoDB Error: ' + err.message))

// set up people model
const peopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
}, { timestamps: true });

const People = mongoose.model('People', peopleSchema);

// mount middleware
app.use(express.json()); // this creates req.body using incoming JSON from our requests
app.use(morgan('dev'));
app.use(cors());

// routes
app.get('/', (req, res) => {
    res.send('welcome to the people api');
});

// index route
app.get('/people', async (req, res) => {
    try {
        res.json(await People.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

// create route
app.post('/people', async (req, res) => {
    try {
        res.json(await People.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

// update
app.put('/people/:id', async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { 
                new: true 
            }
        ))
    } catch (error) {
        res.status(400).json(error);
    }
});


// delete

// tell the app to listen
app.listen(PORT, () => {
    console.log(`Express is listening on port:${PORT}`);
});


