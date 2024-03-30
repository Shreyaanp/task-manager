const supertest = require('supertest');
const { MongoClient } = require('mongodb');

const uri = 'add your uri here';

const client = new MongoClient(uri);

const request = supertest('http://localhost:3000');

beforeAll(async () => {
  await client.connect();
  await client.db('your_database_name').collection('tasks').deleteMany({});
});

afterAll(async () => {
  await client.close();
});

describe('Tasks API', () => {
  let insertedTaskId;

  it('POST /api/tasks should create a new task', async () => {
    const newTask = {
      title: 'New Task',
      description: 'A new task description',
      status: 'To Do',
    };

    const response = await request.post('/api/tasks').send(newTask);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    insertedTaskId = response.body._id;
    console.log(insertedTaskId);
  });

  it('GET /api/tasks should return a list of tasks', async () => {
    const response = await request.get('/api/tasks');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});
