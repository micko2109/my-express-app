const request = require('supertest');
const app = require('../server');

describe('GET /hello', () => {
  it('should respond with Hello World', async () => {
    const res = await request(app).get('/hello');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello World!');
  });

  it('should return correct content type', async () => {
    const res = await request(app).get('/hello');
    expect(res.headers['content-type']).toMatch(/text\/html/);
  });

  it('should handle GET method correctly', async () => {
    const res = await request(app).get('/hello');
    expect(res.statusCode).toBe(200);
  });

  it('should not allow POST method', async () => {
    const res = await request(app).post('/hello').send({});
    expect(res.statusCode).toBe(404);
  });

  it('should not allow PUT method', async () => {
    const res = await request(app).put('/hello').send({});
    expect(res.statusCode).toBe(404);
  });

  it('should not allow DELETE method', async () => {
    const res = await request(app).delete('/hello');
    expect(res.statusCode).toBe(404);
  });

  it('should respond quickly', async () => {
    const start = Date.now();
    await request(app).get('/hello');
    const end = Date.now();
    expect(end - start).toBeLessThan(100);
  });

  it('should have correct response length', async () => {
    const res = await request(app).get('/hello');
    expect(res.text.length).toBeGreaterThan(0);
  });

  it('should handle multiple requests', async () => {
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(request(app).get('/hello'));
    }
    const results = await Promise.all(promises);
    results.forEach(res => {
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Hello World!');
    });
  });
});
