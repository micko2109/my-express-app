const request = require('supertest');
const app = require('../server');

describe("Books API", () => {
  beforeEach(() => {
    // Reset books array before each test
    app.locals.books = [
      { id: 1, title: "Book 1", ratings: [] },
      { id: 2, title: "Book 2", ratings: [] },
    ];
  });

  it("should return all books", async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
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
    expect(res.body).toHaveProperty('title', 'Book 1');
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
  it("should search books by title", async () => {
    const res = await request(app).get('/books/search?title=Book');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should return empty array for no matching search", async () => {
    const res = await request(app).get('/books/search?title=NonExistent');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 400 if title query is missing", async () => {
    const res = await request(app).get('/books/search');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Title query parameter is required');
  });

  // Tests for POST /books/:id/rate
  it("should add a rating to a book", async () => {
    const res = await request(app)
      .post('/books/1/rate')
      .send({ rating: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Rating added successfully');
    expect(res.body.book.ratings).toContain(5);
  });

  it("should return 400 for invalid rating", async () => {
    const res = await request(app)
      .post('/books/1/rate')
      .send({ rating: 6 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Rating must be an integer between 1 and 5');
  });

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

  // Additional 10 backend tests
  it("should handle rating with minimum value 1", async () => {
    const res = await request(app)
      .post('/books/1/rate')
      .send({ rating: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.book.ratings).toContain(1);
  });

  it("should handle rating with maximum value 5", async () => {
    const res = await request(app)
      .post('/books/1/rate')
      .send({ rating: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.book.ratings).toContain(5);
  });

  it("should return 400 for rating below 1", async () => {
    const res = await request(app)
      .post('/books/1/rate')
      .send({ rating: 0 });
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 for non-integer rating", async () => {
    const res = await request(app)
      .post('/books/1/rate')
      .send({ rating: 3.5 });
    expect(res.statusCode).toBe(400);
  });

  it("should calculate stats correctly with ratings", async () => {
    // Add ratings first
    await request(app).post('/books/1/rate').send({ rating: 4 });
    await request(app).post('/books/1/rate').send({ rating: 5 });
    await request(app).post('/books/2/rate').send({ rating: 3 });

    const res = await request(app).get('/books/stats');
    expect(res.body.totalBooks).toBe(2);
    expect(res.body.totalRatings).toBe(3);
    expect(res.body.averageRating).toBe(4.0); // (4+5+3)/3 = 4
  });

  it("should handle search with partial title match", async () => {
    const res = await request(app).get('/books/search?title=ook');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2); // Book 1 and Book 2
  });

  it("should handle search case insensitive", async () => {
    const res = await request(app).get('/books/search?title=book');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should return 400 for search with empty title", async () => {
    const res = await request(app).get('/books/search?title=');
    expect(res.statusCode).toBe(400);
  });

  it("should update book and retain ratings", async () => {
    // Add rating first
    await request(app).post('/books/1/rate').send({ rating: 5 });
    // Update title
    const res = await request(app)
      .put('/books/1')
      .send({ title: "Updated Title" });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Title");
    expect(res.body.ratings).toContain(5);
  });

  it("should handle multiple ratings on same book", async () => {
    await request(app).post('/books/1/rate').send({ rating: 2 });
    await request(app).post('/books/1/rate').send({ rating: 4 });
    const res = await request(app).get('/books/1');
    expect(res.body.ratings).toEqual([2, 4]);
  });
});
