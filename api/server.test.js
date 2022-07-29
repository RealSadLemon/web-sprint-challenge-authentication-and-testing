// Write your tests here
const db = require('../data/dbConfig')
const authRouter = require('../api/auth/auth-router');
const request = require('supertest');
const server = require('../api/server');
const jokes = require('./jokes/jokes-data');

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db.seed.run()
});
afterAll(async () => {
  await db.destroy()
});

describe('API endpoint /api/auth/register', ()=> {
  test('[1] - Uses correct error message and status on invalid credentials', async ()=> {
    let res = await request(server).post('/api/auth/register').send({ username: "Captain Marvel", password: "" });
    expect(res.body.message).toMatch(/username and password required/i)
    expect(res.status).toBe(400)
    res = await request(server).post('/api/auth/register').send({ username: "", password: "foobar" });
    expect(res.body.message).toMatch(/username and password required/i)
    expect(res.status).toBe(400)
  })
  test('[2] - Uses correct error message and status on username being taken', async ()=> {
    let res = await request(server).post('/api/auth/register').send({ username: "rowValue1", password: "12345"})
    expect(res.body.message).toMatch(/username taken/i)
    expect(res.status).toBe(403)
  })
  test('[3] - Returns "id" "username" and "password" object with status code 201', async () => {
    let res = await request(server).post('/api/auth/register').send({ username: "Captain Marvel", password: "foobar" })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('username')
    expect(res.body).toHaveProperty('password')
  })
})

describe('API endpoint /api/auth/login', ()=> {
  test('[4] - Failed logins return the correct status code and message', async ()=> {
    let res = await request(server).post('/api/auth/login').send({ username: "", password: "foobar" })
    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/username and password required/i)
    res = await request(server).post('/api/auth/login').send({ username: "Captain Marvel", password: "barfoo" })
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/invalid credentials/i)
  })
  test('[5] - Successful logins return a message and a token', async () => {
    let res = await  request(server).post('/api/auth/login').send({ username: "rowValue2", password: "12345" })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body).toHaveProperty('token')
  })
})
describe('API endpoint /api/jokes', ()=> {
  test('[6] - Returns 401 and message when without correct token', async ()=> {
    let res = await request(server).get('/api/jokes')
    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('message')
  })
  test('[7] - When logged in returns correct jokes array', async ()=> {
    let res = await request(server).post('/api/auth/login').send({ username: "rowValue3", password: "12345"})
    res = await request(server).get('/api/jokes').set('Authorization', res.body.token)
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject(jokes)
  })
})
