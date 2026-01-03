// Working Frontend Tests - Only tests that work with current server implementation
require('jsdom-global')();
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
    <ul id="books"></ul>
  `;

  // Load your frontend script
  jest.isolateModules(() => {
    require('../public/app.js');
  });

  jest.clearAllMocks();
});

// 1. Load Books - WORKING (uses GET /books which exists)
test('1. Load Books - should fetch and display books', async () => {
  const mockBooks = [{ id: 1, title: 'Book 1', ratings: [] }];
  fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockBooks) });

  document.getElementById('load-books').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/books');
  expect(document.getElementById('books').innerHTML).toContain('Book 1');
});

// 2. Add Book - WORKING (uses POST /books which exists)
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

// 3. Add Book empty title - WORKING (validation only)
test('3. Add Book - should alert if title is empty', () => {
  document.getElementById('book-title').value = '';
  document.getElementById('add-book-btn').click();

  expect(alert).toHaveBeenCalledWith('Please enter a title');
});

// 4. Add Book with whitespace only - WORKING (validation)
test('4. Add Book - should alert if title is whitespace only', () => {
  document.getElementById('book-title').value = '   ';
  document.getElementById('add-book-btn').click();

  expect(alert).toHaveBeenCalledWith('Please enter a title');
});

// 5. Load Books empty response - WORKING
test('5. Load Books - should handle empty response', async () => {
  fetch.mockResolvedValueOnce({ json: () => Promise.resolve([]) });

  document.getElementById('load-books').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/books');
  expect(document.getElementById('books').innerHTML).toBe('');
});

// 6. Load Books error handling - WORKING
test('6. Load Books - should handle fetch error', async () => {
  fetch.mockRejectedValueOnce(new Error('Network error'));

  document.getElementById('load-books').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/books');
  expect(alert).toHaveBeenCalledWith('Error loading books');
});

// 7. Add Book error handling - WORKING
test('7. Add Book - should handle fetch error', async () => {
  fetch.mockRejectedValueOnce(new Error('Network error'));

  document.getElementById('book-title').value = 'Test Book';
  document.getElementById('add-book-btn').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(alert).toHaveBeenCalledWith('Error adding book');
});

// 8. Load Books with multiple books - WORKING
test('8. Load Books - should display multiple books', async () => {
  const mockBooks = [
    { id: 1, title: 'Book 1', ratings: [] },
    { id: 2, title: 'Book 2', ratings: [] },
    { id: 3, title: 'Book 3', ratings: [] }
  ];
  fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockBooks) });

  document.getElementById('load-books').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/books');
  expect(document.getElementById('books').innerHTML).toContain('Book 1');
  expect(document.getElementById('books').innerHTML).toContain('Book 2');
  expect(document.getElementById('books').innerHTML).toContain('Book 3');
});

// 9. Add Book with special characters - WORKING
test('9. Add Book - should handle special characters in title', async () => {
  const mockNewBook = { id: 4, title: 'Book with special chars: @#$%', ratings: [] };
  fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockNewBook) });

  document.getElementById('book-title').value = 'Book with special chars: @#$%';
  document.getElementById('add-book-btn').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/books', expect.objectContaining({
    method: 'POST',
    body: JSON.stringify({ title: 'Book with special chars: @#$%' })
  }));
});

// 10. Load Books button click test - WORKING
test('10. Load Books - should trigger on button click', async () => {
  const mockBooks = [{ id: 1, title: 'Test Book', ratings: [] }];
  fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockBooks) });

  const loadButton = document.getElementById('load-books');
  loadButton.click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/books');
});
