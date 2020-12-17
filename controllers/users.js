const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

//-------------------------------
//------- POST ONE USER ---------
//-------------------------------
usersRouter.post('/', async (request, response, next) =>
{
    const body = request.body
    if (body.password === undefined)
    {
        return response.status(400).json({error: 'Password missing. Password required.'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    try
    {
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch (exception)
    {
        response.status(400)
        next(exception)
    }
})

//-------------------------------
//-------- GET ALL USERS --------
//-------------------------------
usersRouter.get('/', async (request, response) =>
{
    const users = await User
        .find({})
        .populate('blogs', {
            url: 1,
            title: 1,
            author: 1,
            id: 1
        })
    response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter    