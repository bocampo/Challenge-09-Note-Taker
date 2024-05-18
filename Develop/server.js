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


app.delete('api/notes/:id', (req, res) => {
    /*
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        let notes = JSON.parse(data);
        const noteId = req.params.id;

        // Find the index of the note with the provided ID
        const noteIndex = notes.findIndex(note => note.id === noteId);

        if (noteIndex === -1) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }

        // Remove the note from the array
        notes.splice(noteIndex, 1);

        // Write the updated notes back to the db.json file
        fs.writeFile(dbFilePath, JSON.stringify(notes, null, 2), err => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            res.json({ message: 'Note deleted successfully' });
        });
    });*/
})


app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});