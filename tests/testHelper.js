const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Blog X',
        author: 'Person Y',
        url: 'www.blogx.com',
        likes: 100
    },
    {
        title: 'Blog f',
        author: 'Person H',
        url: 'www.blogf.com',
        likes: 200
    },
    {
        title: 'Blog M',
        author: 'Person N',
        url: 'www.blogm.com',
        likes: 300
    },
    {
        title: 'Blog I',
        author: 'Person J',
        url: 'www.blogi.com',
        likes: 400
    },
]

const usersInDb = async () =>
{
    const users = await User.find({})
    return users.map(u => u.toJSON())
}




module.exports = {
    initialBlogs,
    usersInDb
}