const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./testHelper')
const mongoose = require('mongoose')
const supertest = require('supertest')

const api = supertest(app)

describe('only one user', () =>
{
    beforeEach(async () =>
    {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('add new user', async () =>
    {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'testiukko',
            name: 'Testi Käyttäjä',
            password: 'testisalasana',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('no duplicates', async () =>
    {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('no user without username', async () =>
    {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'No Username',
            password: 'wordforpassing',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` is required')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('no user without password', async () =>
    {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ihatepasswords',
            name: 'I Never Use Passwords'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Password required.')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('user can be found with get', async () =>
    {
        const response = await api.get('/api/users/')
        expect(response.body).toHaveLength(1)
    })
})

afterAll(async () =>
{
    await mongoose.connection.close()
})