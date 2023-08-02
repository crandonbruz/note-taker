const express = require("express");
const fs = require("fs");
const path = require("path");
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
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
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
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    const database = JSON.parse(data);
    database.push(req.body);
    fs.writeFile("./db/db.json", JSON.stringify(database), () => {
      res.json(database);
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const database = JSON.parse(fs.readFile("./db/db.json"));
  const notesDeleted = database.filter((item) => item.id !== req.params.id);
  fs.writeFile("./db/db.json", JSON.stringify(notesDeleted));
  res.json(notesDeleted);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
