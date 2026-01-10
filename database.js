
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'books.json');

// Initialize database with some default data
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        try {
            if (!fs.existsSync(DATA_FILE)) {
                // Create initial data with some sample books
                const initialData = [
                    { id: 1, title: "The Great Gatsby", ratings: [] },
                    { id: 2, title: "To Kill a Mockingbird", ratings: [] },
                    { id: 3, title: "1984", ratings: [] }
                ];
                fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
            }
            console.log('Database initialized successfully');
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

// Helper function to read all books from file
function readBooksFromFile() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Helper function to write books to file
function writeBooksToFile(books) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2));
}

// Get all books
function getAllBooks() {
    return new Promise((resolve, reject) => {
        try {
            const books = readBooksFromFile();
            resolve(books);
        } catch (err) {
            reject(err);
        }
    });
}

// Get book by ID
function getBookById(id) {
    return new Promise((resolve, reject) => {
        try {
            const books = readBooksFromFile();
            const book = books.find(b => b.id === parseInt(id));
            resolve(book || null);
        } catch (err) {
            reject(err);
        }
    });
}

// Create new book
function createBook(title) {
    return new Promise((resolve, reject) => {
        try {
            const books = readBooksFromFile();
            
            // Check if book with same title exists
            const existingBook = books.find(b => b.title.toLowerCase() === title.toLowerCase());
            if (existingBook) {
                const error = new Error('Book with this title already exists');
                error.code = 'UNIQUE_CONSTRAINT';
                throw error;
            }
            
            const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
            const newBook = {
                id: newId,
                title: title,
                ratings: []
            };
            
            books.push(newBook);
            writeBooksToFile(books);
            resolve(newBook);
        } catch (err) {
            reject(err);
        }
    });
}

// Update book
function updateBook(id, title) {
    return new Promise((resolve, reject) => {
        try {
            const books = readBooksFromFile();
            const bookIndex = books.findIndex(b => b.id === parseInt(id));
            
            if (bookIndex === -1) {
                resolve(null);
                return;
            }
            
            // Check if another book with same title exists
            const existingBook = books.find(b => b.title.toLowerCase() === title.toLowerCase() && b.id !== parseInt(id));
            if (existingBook) {
                const error = new Error('Book with this title already exists');
                error.code = 'UNIQUE_CONSTRAINT';
                throw error;
            }
            
            books[bookIndex].title = title;
            writeBooksToFile(books);
            resolve(books[bookIndex]);
        } catch (err) {
            reject(err);
        }
    });
}

// Delete book
function deleteBook(id) {
    return new Promise((resolve, reject) => {
        try {
            const books = readBooksFromFile();
            const bookIndex = books.findIndex(b => b.id === parseInt(id));
            
            if (bookIndex === -1) {
                resolve(false);
                return;
            }
            
            books.splice(bookIndex, 1);
            writeBooksToFile(books);
            resolve(true);
        } catch (err) {
            reject(err);
        }
    });
}

// Search books by title
function searchBooks(searchTerm) {
    return new Promise((resolve, reject) => {
        try {
            const books = readBooksFromFile();
            const lowerSearchTerm = searchTerm.toLowerCase();
            const filteredBooks = books.filter(b => 
                b.title.toLowerCase().includes(lowerSearchTerm)
            );
            resolve(filteredBooks);
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    initializeDatabase,
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    searchBooks
};
