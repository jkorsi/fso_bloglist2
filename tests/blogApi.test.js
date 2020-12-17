const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./testHelper')

const api = supertest(app)
const initialBlogs = helper.initialBlogs
const bcrypt = require('bcrypt')

//-------------------------------
//---- INITIALIZE TEST BLOGS ----
//-------------------------------
beforeEach(async () => {
    await Blog.deleteMany({})
    const blogs = await Blog.insertMany(initialBlogs)
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('btest', 10)
    
    const user = new User({
        username: 'btest',
        name:'blogtest',
        passwordHash
    })

    const blogUser = await user.save()
    //const userId = blogUser._id.toString()

    //UPDATE Blogs to have the btest as user
    await Blog.updateMany({}, {'$set': {'user': blogUser._id}})

    //UPDATE User to have blogs
    await User.findByIdAndUpdate(blogUser._id, {'$set': {'blogs': blogs.map(b => b._id)}})
})

test('CORRECT CONTENT TYPE', async () =>
{

    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('CORRECT BLOG AMOUNT', async () =>
{
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('ADD BLOG', async () =>
{
    const newBlog = {
        title: 'New Blog',
        author: 'New Blogger',
        url: 'www.newblog.com',
        likes: 123
    }
    const loginUser = {
        username:'btest',
        password:'btest'       
    }
    
    const login = await api
        .post('/api/login')
        .send(loginUser)
    
    const token = login.body.token

    await api
        .post('/api/blogs')
        .set('Authorization', 'bearer '+ token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(titles).toContainEqual('New Blog')
})

test('CANT\'T ADD BLOG WITHOUT TOKEN', async () =>
{
    const newBlog = {
        title: 'New Blog',
        author: 'New Blogger',
        url: 'www.newblog.com',
        likes: 123
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        //.expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('ID MUST BE DEFINED', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    let blogToTest
    for (var i = 0, len = blogs.length; i < len; i++){
        blogToTest = blogs[i]
        expect(blogToTest.id).toBeDefined()
    }
})

test('LIKES DEFAULT 0', async () =>
{
    await Blog.deleteMany({})

    const newBlog = {
        title: 'Hated Blog',
        author: 'Annoying Blogger',
        url: 'www.annoyingblog.com',
    }

    const loginUser = {
        username: 'btest',
        password: 'btest'
    }

    const login = await api
        .post('/api/login')
        .send(loginUser)
    
    const token = login.body.token

    await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body[0].likes).toBe(0)
})

test('TITLE REQUIRED', async () =>
{
    await Blog.deleteMany({})

    const newBlog = {
        author: 'Annoying Blogger',
        url: 'www.annoyingblog.com',
    }

    const loginUser = {
        username: 'btest',
        password: 'btest'
    }

    const login = await api
        .post('/api/login')
        .send(loginUser)

    const token = login.body.token

    await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token)
        .send(newBlog)
        .expect(400)
        //.expect('Content-Type', /application\/json/)
})

test('URL REQUIRED', async () =>
{
    await Blog.deleteMany({})

    const newBlog = {
        title: 'Hated Blog',
        author: 'Annoying Blogger',
    }

    const loginUser = {
        username: 'btest',
        password: 'btest'
    }

    const login = await api
        .post('/api/login')
        .send(loginUser)

    const token = login.body.token

    await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token)
        .send(newBlog)
        .expect(400)
    //.expect('Content-Type', /application\/json/)
})

test('DELETE BLOG', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    const blogToDelete = blogs[0]
    const idOfDeleted = blogToDelete.id

    const loginUser = {
        username: 'btest',
        password: 'btest'
    }

    const login = await api
        .post('/api/login')
        .send(loginUser)

    const token = login.body.token

    await api
        .delete('/api/blogs/' + idOfDeleted)
        .set('Authorization', 'bearer ' + token)
        .expect(204)
})

test('MODIFY ONE, ADD A LIKE', async () =>
{
    const response = await api.get('/api/blogs')
    const blogs = response.body
    const blogToUpdate = blogs[0]

    const originaId = blogToUpdate.id

    const likedBlog = {
        id: blogToUpdate.id,
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1
    }

    await api
        .put('/api/blogs/' + originaId)
        .send(likedBlog)
        .expect(200)

    const res = await api.get('/api/blogs')
    expect(res.body[0].likes).toBe(blogToUpdate.likes + 1)
})


afterAll(async () =>
{
    await mongoose.connection.close()
})