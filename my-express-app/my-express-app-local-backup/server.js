const express = require('express');
const path = require('path');
const app = express();

// In-memory data store
let books = [
  { id: 1, title: 'Sample Book 1', ratings: [5, 4] },
  { id: 2, title: 'Sample Book 2', ratings: [3] }
];
let nextId = 3;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET /books - vrati sve knjige
app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

// GET /books/search?title=... - Search books by title (partial match)
app.get('/books/search', (req, res) => {
  const { title } = req.query;
  if (!title) return res.status(400).json({ error: "Title query parameter is required" });
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
  res.json(filteredBooks);
});

// GET /books/stats - Get statistics: total books, average rating, etc.
app.get('/books/stats', (req, res) => {
  const totalBooks = books.length;
  const totalRatings = books.reduce((sum, book) => sum + book.ratings.length, 0);
  const totalRatingSum = books.reduce((sum, book) => sum + book.ratings.reduce((a, b) => a + b, 0), 0);
  const averageRating = totalRatings > 0 ? totalRatingSum / totalRatings : 0;
  res.json({
    totalBooks,
    totalRatings,
    averageRating: parseFloat(averageRating.toFixed(2))
  });
});

// POST /books - dodaj novu knjigu
app.post('/books', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') return res.status(400).json({ error: "Title is required" });
  const newBook = { id: nextId++, title: title.trim(), ratings: [] };
  books.push(newBook);
  res.status(201).json(newBook);
});

// GET /books/:id - Retrieve a specific book by ID
app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// PUT /books/:id - Update a book's title by ID
app.put('/books/:id', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) return res.status(404).json({ error: "Book not found" });
  book.title = title.trim();
  res.json(book);
});

// DELETE /books/:id - Delete a book by ID
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === bookId);
  if (index === -1) return res.status(404).json({ error: "Book not found" });
  books.splice(index, 1);
  res.status(204).send();
});

// POST /books/:id/rate - Add a rating (1-5) to a book
app.post('/books/:id/rate', (req, res) => {
  const { rating } = req.body;
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be an integer between 1 and 5" });
  }
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) return res.status(404).json({ error: "Book not found" });
  book.ratings.push(rating);
  res.json({ message: "Rating added successfully", book });
});

// Start servera
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // za testove
