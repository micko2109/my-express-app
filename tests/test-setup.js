// Jest setup file - runs before each test file
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'books.json');

// Reset database before each test
beforeEach(() => {
  const initialData = [
    { id: 1, title: "The Great Gatsby", ratings: [] },
    { id: 2, title: "To Kill a Mockingbird", ratings: [] },
    { id: 3, title: "1984", ratings: [] }
  ];
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
});

