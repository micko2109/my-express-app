// Books API Tests - Fixed with proper database isolation
const request = require('supertest');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'books.json');

// Helper function to reset database to initial state
function resetDatabase() {
  const initialData = [
    { id: 1, title: "The Great Gatsby", ratings: [] },
    { id: 2, title: "To Kill a Mockingbird", ratings: [] },
    { id: 3, title: "1984", ratings: [] }
  ];
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Helper function to clear require cache for server modules
function clearServerCache() {
  Object.keys(require.cache).forEach(key => {
    if (key.includes('simple-database') || key.includes('server')) {
      delete require.cache[key];
    }
  });
}

// Helper function to get fresh app with fresh database
function getFreshApp() {
  clearServerCache();
  return require('../server');
}

describe("Books API", () => {
  let app;
  
  beforeEach(() => {
    // Reset database AND get fresh app for each test
    resetDatabase();
    app = getFreshApp();
  });

  it("should return all books", async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3);
    expect(res.body[0]).toHaveProperty('id', 1);
    expect(res.body[0]).toHaveProperty('title', 'The Great Gatsby');
  });

  it("should return books with correct structure", async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('title');
  });

  it("should create a new book", async () => {
    const res = await request(app)
      .post('/books')
      .send({ title: "New Book" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe("New Book");
  });

  it("should create a book with unique id", async () => {
    const res1 = await request(app)
      .post('/books')
      .send({ title: "Book A" });
    // Get fresh app to see updated state
    app = getFreshApp();
    const res2 = await request(app)
      .post('/books')
      .send({ title: "Book B" });
    expect(res1.body.id).not.toBe(res2.body.id);
  });

  it("should fail if title is missing", async () => {
    const res = await request(app)
      .post('/books')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe("Title is required");
  });

  it("should fail if title is empty string", async () => {
    const res = await request(app)
      .post('/books')
      .send({ title: "" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it("should fail if title is only whitespace", async () => {
    const res = await request(app)
      .post('/books')
      .send({ title: "   " });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it("should handle invalid JSON", async () => {
    const res = await request(app)
      .post('/books')
      .set('Content-Type', 'application/json')
      .send('invalid json');
    expect(res.statusCode).toBe(400);
  });

  it("should return correct content type for books", async () => {
    const res = await request(app).get('/books');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  it("should return correct content type for creating book", async () => {
    const res = await request(app)
      .post('/books')
      .send({ title: "Test Book" });
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  // Tests for GET /books/:id
  it("should return a specific book by ID", async () => {
    const res = await request(app).get('/books/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title', 'The Great Gatsby');
  });

  it("should return 404 for non-existent book ID", async () => {
    const res = await request(app).get('/books/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Book not found');
  });

  // Tests for PUT /books/:id
  it("should update a book's title", async () => {
    const res = await request(app)
      .put('/books/1')
      .send({ title: "Updated Book 1" });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Book 1");
  });

  it("should return 400 if title is missing in update", async () => {
    const res = await request(app)
      .put('/books/1')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Title is required');
  });

  it("should return 404 for updating non-existent book", async () => {
    const res = await request(app)
      .put('/books/999')
      .send({ title: "New Title" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Book not found');
  });

  // Tests for DELETE /books/:id
  it("should delete a book by ID", async () => {
    const res = await request(app).delete('/books/1');
    expect(res.statusCode).toBe(204);
    // Verify deletion
    const getRes = await request(app).get('/books/1');
    expect(getRes.statusCode).toBe(404);
  });

  it("should return 404 for deleting non-existent book", async () => {
    const res = await request(app).delete('/books/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Book not found');
  });

  // Tests for GET /books/search
  it("should return empty array for no matching search", async () => {
    const res = await request(app).get('/books/search?title=NonExistentXYZ123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 400 if title query is missing", async () => {
    const res = await request(app).get('/books/search');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Title query parameter is required');
  });

  // Tests for POST /books/:id/rate
  it("should return 404 for rating non-existent book", async () => {
    const res = await request(app)
      .post('/books/999/rate')
      .send({ rating: 4 });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Book not found');
  });

  // Tests for GET /books/stats
  it("should return book statistics", async () => {
    const res = await request(app).get('/books/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalBooks');
    expect(res.body).toHaveProperty('totalRatings');
    expect(res.body).toHaveProperty('averageRating');
  });

  it("should handle search with partial title match", async () => {
    const res = await request(app).get('/books/search?title=Mockingbird');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1); // "To Kill a Mockingbird"
  });

  it("should return 400 for search with empty title", async () => {
    const res = await request(app).get('/books/search?title=');
    expect(res.statusCode).toBe(400);
  });

});

