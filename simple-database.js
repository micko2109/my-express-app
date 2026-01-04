const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'books.json');

// Simple file-based database
class SimpleDatabase {
    constructor() {
        this.data = [];
        this.init();
    }

    init() {
        try {
            if (!fs.existsSync(DATA_FILE)) {
                // Create initial data with some sample books
                this.data = [
                    { id: 1, title: "The Great Gatsby", ratings: [] },
                    { id: 2, title: "To Kill a Mockingbird", ratings: [] },
                    { id: 3, title: "1984", ratings: [] }
                ];
                this.save();
            } else {
                const data = fs.readFileSync(DATA_FILE, 'utf8');
                this.data = JSON.parse(data);
            }
            console.log('Database initialized successfully');
        } catch (err) {
            console.error('Database initialization error:', err);
            this.data = [];
        }
    }

    save() {
        try {
            fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2));
        } catch (err) {
            console.error('Database save error:', err);
        }
    }

    getAll() {
        return [...this.data];
    }

    getById(id) {
        return this.data.find(book => book.id === parseInt(id)) || null;
    }

    create(title) {
        // Check if book with same title exists
        const existingBook = this.data.find(book => book.title.toLowerCase() === title.toLowerCase());
        if (existingBook) {
            const error = new Error('Book with this title already exists');
            error.code = 'UNIQUE_CONSTRAINT';
            throw error;
        }

        const newId = this.data.length > 0 ? Math.max(...this.data.map(b => b.id)) + 1 : 1;
        const newBook = {
            id: newId,
            title: title,
            ratings: []
        };

        this.data.push(newBook);
        this.save();
        return newBook;
    }

    update(id, title) {
        const bookIndex = this.data.findIndex(book => book.id === parseInt(id));

        if (bookIndex === -1) {
            return null;
        }

        // Check if another book with same title exists
        const existingBook = this.data.find(book => book.title.toLowerCase() === title.toLowerCase() && book.id !== parseInt(id));
        if (existingBook) {
            const error = new Error('Book with this title already exists');
            error.code = 'UNIQUE_CONSTRAINT';
            throw error;
        }

        this.data[bookIndex].title = title;
        this.save();
        return this.data[bookIndex];
    }

    delete(id) {
        const bookIndex = this.data.findIndex(book => book.id === parseInt(id));

        if (bookIndex === -1) {
            return false;
        }

        this.data.splice(bookIndex, 1);
        this.save();
        return true;
    }

    search(searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return this.data.filter(book =>
            book.title.toLowerCase().includes(lowerSearchTerm)
        );
    }
}

// Create and export database instance
const db = new SimpleDatabase();

module.exports = {
    getAllBooks: () => db.getAll(),
    getBookById: (id) => db.getById(id),
    createBook: (title) => db.create(title),
    updateBook: (id, title) => db.update(id, title),
    deleteBook: (id) => db.delete(id),
    searchBooks: (searchTerm) => db.search(searchTerm)
};
