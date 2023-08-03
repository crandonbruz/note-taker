const express = require("express");
const fs = require("fs");
const path = require("path");
const uuid = require('uuid');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(407).json({ error: "The notes didn't read." });
    }
    const database = JSON.parse(data);
    res.json(database);
  });
});


app.post("/api/notes", (req, res) => {
  console.log(req.body);
  fs.readFile("./db/db.json",  (err, data) => {
    const database = JSON.parse(data);
    const { title, text} = req.body;
    const newNote = {
      title,
      text,
      id: uuid.v4()
    }
    console.log(typeof database);
    database.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(database), () => {
      res.json(database);
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
      console.log(req.params.id);
      fs.readFile("./db/db.json", (err, data) => {
        let notes = JSON.parse(data)
        console.log(notes);
        notes = notes.filter(item => item.id !== req.params.id);
        fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Can not ever delete." });
          }
          fs.readFile("./db/db.json", "utf-8", (err, data) => {
            if (err) {
              console.log(err);
              return res.status(407).json({ error: "The note did not post." });
            }
            res.status(200).json(data);
          });
        });
      });
    });
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
