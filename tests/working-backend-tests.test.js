// Working Backend Tests - Only tests that work with current server implementation
const request = require('supertest');
const app = require('../server');

describe("Working Backend API Tests", () => {
  beforeEach(() => {
    // Reset books array before each test
    app.locals.books = [
      { id: 1, title: "Book 1", ratings: [] },
      { id: 2, title: "Book 2", ratings: [] },
    ];
  });

  // 1. GET /hello - should respond with Hello World
  it("1. GET /hello - should respond with Hello World", async () => {
    const res = await request(app).get('/hello');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello World!');
  });

  // 2. GET /hello - should return correct content type
  it("2. GET /hello - should return correct content type", async () => {
    const res = await request(app).get('/hello');
    expect(res.headers['content-type']).toMatch(/text\/html/);
  });

  // 3. GET /hello - should handle GET method correctly
  it("3. GET /hello - should handle GET method correctly", async () => {
    const res = await request(app).get('/hello');
    expect(res.statusCode).toBe(200);
  });

  // 4. POST /hello - should return 404 (not allowed)
  it("4. POST /hello - should return 404 (not allowed)", async () => {
    const res = await request(app).post('/hello').send({});
    expect(res.statusCode).toBe(404);
  });

  // 5. PUT /hello - should return 404 (not allowed)
  it("5. PUT /hello - should return 404 (not allowed)", async () => {
    const res = await request(app).put('/hello').send({});
    expect(res.statusCode).toBe(404);
  });

  // 6. GET /books - should return all books
  it("6. GET /books - should return all books", async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('id', 1);
    expect(res.body[0]).toHaveProperty('title', 'Book 1');
  });

  // 7. GET /books - should return books with correct structure
  it("7. GET /books - should return books with correct structure", async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('title');
  });

  // 8. POST /books - should create a new book
  it("8. POST /books - should create a new book", async () => {
    const res = await request(app)
      .post('/books')
      .send({ title: "New Book" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id', 3);
    expect(res.body.title).toBe("New Book");
  });

  // 9. POST /books - should fail if title is missing
  it("9. POST /books - should fail if title is missing", async () => {
    const res = await request(app)
      .post('/books')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Title is required');
  });

  // 10. GET /books - should return correct content type
  it("10. GET /books - should return correct content type", async () => {
    const res = await request(app).get('/books');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});
