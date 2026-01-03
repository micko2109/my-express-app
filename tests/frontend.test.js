// frontend.test.js
require('jsdom-global')(); // automatski kreira global.document i global.window
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock fetch globally
global.fetch = jest.fn();
global.alert = jest.fn();

beforeEach(() => {
  document.body.innerHTML = `
    <button id="load-books"></button>
    <input id="book-title" />
    <button id="add-book-btn"></button>
    <input id="search-title" />
    <button id="search-btn"></button>
    <input id="book-id" />
    <button id="get-book-btn"></button>
    <input id="update-id" />
    <input id="update-title" />
    <button id="update-btn"></button>
    <input id="rate-id" />
    <input id="rating" />
    <button id="rate-btn"></button>
    <input id="delete-id" />
    <button id="delete-btn"></button>
    <button id="get-stats"></button>
    <ul id="books"></ul>
    <ul id="search-results"></ul>
    <div id="book-info"></div>
    <div id="stats-info"></div>
  `;

  // Load your frontend script
  jest.isolateModules(() => {
    require('../public/app.js');
  });

  jest.clearAllMocks();
});

// 1. Load Books
test('1. Load Books - should fetch and display books', async () => {
  const mockBooks = [{ id: 1, title: 'Book 1', ratings: [] }];
  fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockBooks) });

  document.getElementById('load-books').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/books');
  expect(document.getElementById('books').innerHTML).toContain('Book 1');
});

// 2. Add Book
test('2. Add Book - should post new book and refresh list', async () => {
  const mockNewBook = { id: 3, title: 'New Book', ratings: [] };
  fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockNewBook) });

  document.getElementById('book-title').value = 'New Book';
  document.getElementById('add-book-btn').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/books', expect.objectContaining({
    method: 'POST',
    body: JSON.stringify({ title: 'New Book' })
  }));
  expect(alert).toHaveBeenCalledWith('Book added: ' + JSON.stringify(mockNewBook));
});

// 3. Search Books
test('3. Search Books - should fetch search results', async () => {
  const mockResults = [{ id: 1, title: 'Book 1' }];
  fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResults) });

  document.getElementById('search-title').value = 'Book';
  document.getElementById('search-btn').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/books/search?title=Book');
  expect(document.getElementById('search-results').innerHTML).toContain('Book 1');
});

// 4. Get Book
test('4. Get Book - should fetch and display book details', async () => {
  const mockBook = { id: 1, title: 'Book 1', ratings: [5] };
  fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockBook) });

  document.getElementById('book-id').value = '1';
  document.getElementById('get-book-btn').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/books/1');
  expect(document.getElementById('book-info').innerHTML).toContain('Book 1');
});

// 5. Update Book
test('5. Update Book - should put updated book', async () => {
  const mockUpdatedBook = { id: 1, title: 'Updated Book' };
  fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockUpdatedBook) });

  document.getElementById('update-id').value = '1';
  document.getElementById('update-title').value = 'Updated Book';
  document.getElementById('update-btn').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/books/1', expect.objectContaining({
    method: 'PUT',
    body: JSON.stringify({ title: 'Updated Book' })
  }));
  expect(alert).toHaveBeenCalledWith('Book updated: ' + JSON.stringify(mockUpdatedBook));
});

// 6. Rate Book
test('6. Rate Book - should post rating', async () => {
  const mockResult = { message: 'Rating added successfully', book: { id: 1, ratings: [5] } };
  fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResult) });

  document.getElementById('rate-id').value = '1';
  document.getElementById('rating').value = '5';
  document.getElementById('rate-btn').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/books/1/rate', expect.objectContaining({
    method: 'POST',
    body: JSON.stringify({ rating: 5 })
  }));
  expect(alert).toHaveBeenCalledWith('Rating added: Rating added successfully');
});

// 7. Delete Book
test('7. Delete Book - should delete book', async () => {
  fetch.mockResolvedValueOnce({});

  document.getElementById('delete-id').value = '1';
  document.getElementById('delete-btn').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/books/1', expect.objectContaining({
    method: 'DELETE'
  }));
  expect(alert).toHaveBeenCalledWith('Book deleted');
});

// 8. Get Stats
test('8. Get Stats - should fetch and display stats', async () => {
  const mockStats = { totalBooks: 2, totalRatings: 3, averageRating: 4.5 };
  fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockStats) });

  document.getElementById('get-stats').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/books/stats');
  expect(document.getElementById('stats-info').innerHTML).toContain('Total Books: 2');
});

// 9. Add Book empty title
test('9. Add Book - should alert if title is empty', () => {
  document.getElementById('book-title').value = '';
  document.getElementById('add-book-btn').click();

  expect(alert).toHaveBeenCalledWith('Please enter a title');
});

// 10. Search Books empty title
test('10. Search Books - should alert if search title is empty', () => {
  document.getElementById('search-title').value = '';
  document.getElementById('search-btn').click();

  expect(alert).toHaveBeenCalledWith('Please enter a search title');
});
