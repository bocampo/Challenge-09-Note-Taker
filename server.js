const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend, writeToFile } = require('./helpers/fsUtils');
const { readFile, writeFile } = require('fs').promises;

const fs = require('fs');
const { randomUUID } = require('crypto');

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

    readAndAppend({ "title": title, "text": text, "id": crypto.randomUUID() }, './db/db.json');

    res.json({ "message": "Success" });
});


app.delete('/api/notes/:id', (req, res) => {

    readFile('./db/db.json', 'utf8').then((data) => {

        const parseData = JSON.parse(data);

        const newData = parseData.filter(note => {
            console.log(note.id);
            return req.params.id != note.id
        }

        );
        console.log(newData);

        writeFile('./db/db.json', JSON.stringify(newData))
            .then(() => {
                res.json(newData);
            }).catch(err => {
                console.log(err);
            });
    });
})


app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});