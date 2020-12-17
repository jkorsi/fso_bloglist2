const _ = require('lodash') 

//-----------------------------
//----------- DUMMY -----------
//-----------------------------
const dummy = () =>
{
    return 1
}

//-----------------------------
//----------- LIKES -----------
//-----------------------------
const totalLikes = (blogs) =>
{ 
    const reducer = (sum, blog) =>
    {
        return sum + blog.likes
    } 

    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)   
}

const favoriteBlog = (blogs) =>
{
    let favBlog = {
        title: '',
        author: '', 
        likes: 0
    }
    //Title -> Author -> Likes
    //const {title, author, likes} = blogs.find(blog => blog.likes = max)
    blogs.reduce((currentMax, blog) =>
    {
        if (blog.likes > currentMax)
        {
            favBlog = {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
        } 
        return Math.max(currentMax, blog.likes)
    }, 0)

    return blogs.length === 0
        ? 'No blogs'
        : favBlog
}


const mostBlogs = (blogs) =>
{
    const blogsWithCounts = _(blogs)
        .groupBy('author')
        .map((uniqueBlogs, author) => ({author, blogs: uniqueBlogs.length}))
        .value()
    //console.log(blogsWithCounts)

    return blogs.length === 0
        ? 'No blogs'
        : _.maxBy(blogsWithCounts, 'blogs')
        
}

const mostLikes = (blogs) =>
{
    const blogsWithLikes = _(blogs)
        .groupBy('author')
        .map((blogsList, author) => ({author, likes: _.sumBy(blogsList, 'likes')}))
        .value()
    //console.log(blogsWithLikes)

    return blogs.length === 0
        ? 'No blogs'
        : _.maxBy(blogsWithLikes, 'likes')

}



//-----------------------------
//---------- EXPORT -----------
//-----------------------------
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}

/*USE THIS LATER IN TASK 4.X
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce*/

/*let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice']

let countedNames = names.reduce(function (allNames, name) {
  if (name in allNames) {
    allNames[name]++
  }
  else {
    allNames[name] = 1
  }
  return allNames
}, {})*/