const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
//const api = require('./routes/api');

const fs = require('fs');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} received`);

    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} received`);
    const { title, text } = req.body;

    readAndAppend({ "title": title, "text": text }, './db/db.json');

    res.json({ "message": "Success" });
});

/*
app.delete('api/notes', (req, res) => {

})
*/

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});