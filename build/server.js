const express = require('express');
const app = express();

app.use(express.json());

// Simple in-memory data
let books = [
  { id: 1, title: "Book 1" },
  { id: 2, title: "Book 2" },
];

// GET /books - vrati sve knjige
app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

// POST /books - dodaj novu knjigu
app.post('/books', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  const newBook = { id: books.length + 1, title };
  books.push(newBook);
  res.status(201).json(newBook);
});

// Start servera
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // za testove
