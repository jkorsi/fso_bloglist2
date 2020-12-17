const listHelper = require('../utils/list_helper')

test('dummy returns one', () =>
{
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

const listOfManyBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    }, {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }, {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    }, {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    }, {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    }, {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }
]

const listOfOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const listOfNoBlogs = []

describe('total likes', () =>
{
    test('multipleBlogsToTest', () =>
    {
        const result = listHelper.totalLikes(listOfManyBlogs)
        expect(result).toBe(36)
    })

    test('onlyOneBlog', () =>
    {
        const result = listHelper.totalLikes(listOfOneBlog)
        expect(result).toBe(5)
    })

    test('emptyList', () =>
    {
        const result = listHelper.totalLikes(listOfNoBlogs)
        expect(result).toBe(0)
    })
})

describe('favorite blog', () =>
{
    test('multipleBlogsToTest', () =>
    {
        const result = listHelper.favoriteBlog(listOfManyBlogs)
        //console.log('Result', result)
        expect(result).toEqual({
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            likes: 12
        })
    })

    test('onlyOneBlog', () =>
    {
        const result = listHelper.favoriteBlog(listOfOneBlog)
        expect(result).toEqual({
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })

    test('emptyList', () =>
    {
        const result = listHelper.favoriteBlog(listOfNoBlogs)
        expect(result).toEqual('No blogs')
    })

})

describe('most blogs', () =>
{
    test('multipleBlogsToTest', () =>
    {
        const result = listHelper.mostBlogs(listOfManyBlogs)
        //console.log('TEST RESULT, mostBlogs, multiple:', result)
        expect(result).toEqual({
            author: 'Robert C. Martin',
            blogs: 3
        })
    })

    test('onlyOneBlog', () =>
    {
        const result = listHelper.mostBlogs(listOfOneBlog)
        //console.log('TEST RESULT, mostBlogs, single:', result)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 1
        })
    })

    test('emptyList', () =>
    {
        const result = listHelper.mostBlogs(listOfNoBlogs)
        //console.log('TEST RESULT, mostBlogs, no blogs:', result)
        expect(result).toEqual('No blogs')
    })

})

describe('most likes', () =>
{
    test('multipleBlogsToTest', () =>
    {
        const result = listHelper.mostLikes(listOfManyBlogs)
        //console.log('TEST RESULT, mostLikes, multiple:', result)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17
        })
    })

    test('onlyOneBlog', () =>
    {
        const result = listHelper.mostLikes(listOfOneBlog)
        //console.log('TEST RESULT, mostLikes, single:', result)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })

    test('emptyList', () =>
    {
        const result = listHelper.mostLikes(listOfNoBlogs)
        //console.log('TEST RESULT, mostLikes, no blogs:', result)
        expect(result).toEqual('No blogs')
    })

})