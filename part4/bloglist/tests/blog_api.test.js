const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper')
const { initialBlogs } = require('./test_helper')

const app = require('../app'); // this is your Express app
const api = supertest(app);

const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

let token = null

beforeAll(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('testpassword', 10)
  user = new User({ username: 'testusername', passwordHash }) // Assign a value to the variable in the beforeAll function

  await user.save()

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  token = jwt.sign(userForToken, process.env.SECRET)
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map(blog => new Blog({ ...blog, user: user._id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})


test('blogs are returned as json and there is a correct amount', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })


test('blogs have an id field', async () => {
    const response = await api.get('/api/blogs');
expect(response.body[0].id).toBeDefined();
});


test('new blog can be created', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain('Test Blog')
})
  
test('if likes property is missing, it will default to 0', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)

  expect(response.body.likes).toBe(0)
})
  


test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 5
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
});
  
test('blog without url is not added', async () => {
    const newBlog = {
      title: 'Another Test Blog',
      author: 'Test Author',
      likes: 5
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
});

test('blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).not.toContain(blogToDelete.title)
})

test('blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedInfo = {
    title: 'Updated Title',
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 1
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedInfo)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

  expect(updatedBlog.title).toBe(updatedInfo.title)
  expect(updatedBlog.likes).toBe(updatedInfo.likes)
})

test('adding a blog fails with the proper status code 401 Unauthorized if a token is not provided', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

afterAll(async () => {
  await mongoose.connection.close()
  })
  
  
  