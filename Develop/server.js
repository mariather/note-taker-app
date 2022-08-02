const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/api/notes", (req, res) => {
  console.log(`Hitting the API/Notes Route`);
  res.json(db);
})

app.post("/api/notes", (req, res) => {
  console.log(`Hitting the API/Notes Route (with post request)`);

  let newNote = req.body;
  newNote.id = uuidv4();
  db.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(db), (err) => {
    if(err) throw err;
  });
  res.send(db)
})

app.delete("/api/notes/:id", (req, res) => {
  db.forEach((note, i) => {
    if (note.id === req.params.id) {db.splice(i, 1)}
  })

  // db.splice(db.indexOf(req.params.id), 1);
  fs.writeFile("db/db.json", JSON.stringify(db), (err) => {
    if(err) throw err;
  })
  res.send(db)
})

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, () =>
{
  console.log(`Listening at ${PORT}`);
})