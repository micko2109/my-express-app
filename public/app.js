

const API_BASE = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    // Load Books
    document.getElementById('load-books').addEventListener('click', loadBooks);

    // Add Book
    document.getElementById('add-book-btn').addEventListener('click', addBook);

    // Search Books
    document.getElementById('search-btn').addEventListener('click', searchBooks);

    // Get Book Details
    document.getElementById('get-book-btn').addEventListener('click', getBook);

    // Update Book
    document.getElementById('update-btn').addEventListener('click', updateBook);

    // Rate Book
    document.getElementById('rate-btn').addEventListener('click', rateBook);

    // Delete Book
    document.getElementById('delete-btn').addEventListener('click', deleteBook);

    // Get Stats
    document.getElementById('get-stats').addEventListener('click', getStats);
});

async function loadBooks() {
    try {
        const response = await fetch(`${API_BASE}/books`);
        const books = await response.json();
        const booksList = document.getElementById('books');
        booksList.innerHTML = '';
        books.forEach(book => {
            const li = document.createElement('li');
            li.textContent = `ID: ${book.id}, Title: ${book.title}, Ratings: ${book.ratings.join(', ')}`;
            booksList.appendChild(li);
        });
    } catch (error) {
        alert('Error loading books: ' + error.message);
    }
}

async function addBook() {
    const title = document.getElementById('book-title').value;
    if (!title) return alert('Please enter a title');
    try {
        const response = await fetch(`${API_BASE}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        const newBook = await response.json();
        alert('Book added: ' + JSON.stringify(newBook));
        document.getElementById('book-title').value = '';
        loadBooks(); // Refresh list
    } catch (error) {
        alert('Error adding book: ' + error.message);
    }
}

async function searchBooks() {
    const title = document.getElementById('search-title').value;
    if (!title) return alert('Please enter a search title');
    try {
        const response = await fetch(`${API_BASE}/books/search?title=${encodeURIComponent(title)}`);
        const results = await response.json();
        const searchResults = document.getElementById('search-results');
        searchResults.innerHTML = '';
        results.forEach(book => {
            const li = document.createElement('li');
            li.textContent = `ID: ${book.id}, Title: ${book.title}`;
            searchResults.appendChild(li);
        });
    } catch (error) {
        alert('Error searching books: ' + error.message);
    }
}

async function getBook() {
    const id = document.getElementById('book-id').value;
    if (!id) return alert('Please enter a book ID');
    try {
        const response = await fetch(`${API_BASE}/books/${id}`);
        const book = await response.json();
        const bookInfo = document.getElementById('book-info');
        bookInfo.innerHTML = `<p>ID: ${book.id}</p><p>Title: ${book.title}</p><p>Ratings: ${book.ratings.join(', ')}</p>`;
    } catch (error) {
        alert('Error getting book: ' + error.message);
    }
}

async function updateBook() {
    const id = document.getElementById('update-id').value;
    const title = document.getElementById('update-title').value;
    if (!id || !title) return alert('Please enter ID and title');
    try {
        const response = await fetch(`${API_BASE}/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        const updatedBook = await response.json();
        alert('Book updated: ' + JSON.stringify(updatedBook));
        loadBooks(); // Refresh list
    } catch (error) {
        alert('Error updating book: ' + error.message);
    }
}

async function rateBook() {
    const id = document.getElementById('rate-id').value;
    const rating = document.getElementById('rating').value;
    if (!id || !rating) return alert('Please enter ID and rating');
    try {
        const response = await fetch(`${API_BASE}/books/${id}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: parseInt(rating) })
        });
        const result = await response.json();
        alert('Rating added: ' + result.message);
        loadBooks(); // Refresh list
    } catch (error) {
        alert('Error rating book: ' + error.message);
    }
}

async function deleteBook() {
    const id = document.getElementById('delete-id').value;
    if (!id) return alert('Please enter a book ID');
    try {
        await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE' });
        alert('Book deleted');
        loadBooks(); // Refresh list
    } catch (error) {
        alert('Error deleting book: ' + error.message);
    }
}

async function getStats() {
    try {
        const response = await fetch(`${API_BASE}/books/stats`);
        const stats = await response.json();
        const statsInfo = document.getElementById('stats-info');
        statsInfo.innerHTML = `<p>Total Books: ${stats.totalBooks}</p><p>Total Ratings: ${stats.totalRatings}</p><p>Average Rating: ${stats.averageRating}</p>`;
    } catch (error) {
        alert('Error getting stats: ' + error.message);
    }
}
