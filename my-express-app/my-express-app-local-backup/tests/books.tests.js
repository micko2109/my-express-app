const request = require('supertest');
const app = require('../server');

describe("Books API", () => {
  it("should return all books", async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should create a new book", async () => {
    const res = await request(app)
      .post('/books')
      .send({ title: "New Book" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe("New Book");
  });

  it("should fail if title is missing", async () => {
    const res = await request(app)
      .post('/books')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
