


const express = require('express');
const path = require('path');
const app = express();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks
} = require('./simple-database');

app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// Root route - serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Database is now initialized in simple-database.js


// GET /books/search - Search books by title
app.get('/books/search', async (req, res) => {
    const { title } = req.query;
    if (!title) {
        return res.status(400).json({ error: "Title query parameter is required" });
    }
    

    try {
        const filteredBooks = await searchBooks(title);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(filteredBooks));
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).end(JSON.stringify({ error: "Database error" }));
    }
});

// GET /books/stats - Get book statistics
app.get('/books/stats', async (req, res) => {
    try {
        const books = await getAllBooks();
        const totalBooks = books.length;
        let totalRatings = 0;
        let sumRatings = 0;

        books.forEach(book => {
            totalRatings += book.ratings.length;
            sumRatings += book.ratings.reduce((a, b) => a + b, 0);
        });

        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

        res.json({
            totalBooks,
            totalRatings,
            averageRating
        });
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// GET /books - vrati sve knjige
app.get('/books', async (req, res) => {

    try {
        const books = await getAllBooks();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(books));
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).end(JSON.stringify({ error: "Database error" }));
    }
});

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

// POST /books - dodaj novu knjigu
app.post('/books', async (req, res) => {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: "Title is required" });
    }
    

    try {
        const newBook = await createBook(title.trim());
        res.status(201).json(newBook);
    } catch (err) {
        if (err.code === 'UNIQUE_CONSTRAINT') {
            res.status(400).json({ error: "Book with this title already exists" });
        } else {
            res.status(500).json({ error: "Database error" });
        }
    }
});

// GET /books/:id - Get a specific book
app.get('/books/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
        const book = await getBookById(id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// PUT /books/:id - Update a book
app.put('/books/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { title } = req.body;
    
    if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: "Title is required" });
    }


    try {
        const updatedBook = await updateBook(id, title.trim());
        if (!updatedBook) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.json(updatedBook);
    } catch (err) {
        if (err.code === 'UNIQUE_CONSTRAINT') {
            res.status(400).json({ error: "Book with this title already exists" });
        } else {
            res.status(500).json({ error: "Database error" });
        }
    }
});

// DELETE /books/:id - Delete a book
app.delete('/books/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
        const deleted = await deleteBook(id);
        if (!deleted) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// POST /books/:id/rate - Rate a book
app.post('/books/:id/rate', async (req, res) => {
    const id = parseInt(req.params.id);
    const { rating } = req.body;

    try {
        const book = await getBookById(id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be an integer between 1 and 5" });
        }

        book.ratings.push(rating);
        res.json({ message: "Rating added successfully", book });
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// Start servera
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // za testove

