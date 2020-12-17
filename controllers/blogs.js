const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

//-------------------------------
//-------- GET ALL BLOGS --------
//-------------------------------
blogsRouter.get('/', async (request, response) =>
{
    const blogs = await Blog
        .find({})
        .populate('user', {username: 1, name: 1})
    response.json(blogs.map(b => b.toJSON()))
})

//-------------------------------
//-------- POST ONE BLOG --------
//-------------------------------
blogsRouter.post('/', async (request, response, next) =>
{
    const blog = new Blog(request.body)
    if (!request.token)
    {
        console.log('Token missing')
        return response.status(401).json({error: 'Token required'})
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id)
    {
        console.log('Auth problem')
        return response.status(401).json({error: 'Authorization failed'})
    }

    const user = await User.findById(decodedToken.id)
    blog.user = user._id

    try
    {
        const blogToSave = await blog.save()
        user.blogs = user.blogs.concat(blogToSave._id)
        await user.save()
        response.status(201).json(blogToSave)
    } catch (exception)
    {
        response.status(400)
        next(exception)
    }
})

//-------------------------------
//------- DELETE ONE BLOG -------
//-------------------------------
blogsRouter.delete('/:id', async (request, response, next) =>
{
    const blog = await Blog.findById(request.params.id)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    console.log(blog)
    console.log('Blog user: ', blog.user)

    if (!decodedToken.id || decodedToken.id !== blog.user.toString())
    {
        return response.status(401).json({error: 'Authorization failed'})
    }

    try
    {
        const removedBlog = await Blog.findByIdAndDelete(request.params.id)
        response.status(204).json(removedBlog)
    }
    catch (exception)
    {
        response.status(400)
        next(exception)
    }
})

//-------------------------------
//------ UPDATE ONE BLOG --------
//-------------------------------
blogsRouter.put('/:id', async (request, response, next) =>
{
    try
    {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body)
        response.status(200).json(updatedBlog)
    }
    catch (exception)
    {
        response.status(400)
        next(exception)
    }
})

module.exports = blogsRouter
