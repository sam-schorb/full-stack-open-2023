const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  .find({}).populate('user', { username: 1, name: 1 })

  const formattedBlogs = blogs.map(blog => blog.toJSON())
  response.json(formattedBlogs);
});

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  console.log('Authorization Header:', authorization)
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '')
    console.log('Extracted Token:', token)
    return token
  }
  console.log('No Token Found')
  return null
}

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
    if (blog) {
      response.json(blog.toJSON())
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// POST /api/blogs/:id/comments
blogsRouter.post('/:id/comments', async (request, response, next) => {
  const { id } = request.params;
  const { comment } = request.body;

  // Validate the comment
  if (!comment) {
    return response.status(400).json({ error: 'comment is required' });
  }

  try {
    // Find the blog post
    const blog = await Blog.findById(id);

    // Add the new comment to the blog post's comments
    blog.comments.push(comment);

    // Save the updated blog post
    const updatedBlog = await blog.save();

    response.status(201).json(updatedBlog);
  } catch (error) {
    next(error);
  }
});



blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).end()
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const blogId = request.params.id;

  // Extract the token from the Authorization header
  const token = getTokenFrom(request);

  // Verify the token and get the decoded user ID
  const decodedToken = jwt.verify(token, process.env.SECRET);

  // If the token is not valid, respond with an error
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  // Find the blog from the database
  const blog = await Blog.findById(blogId);

  // If no blog found, respond with an error
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }

  // Compare the ID of the user who created the blog (from the database)
  // with the ID of the user who sent the request (from the token)
  if (blog.user.toString() !== decodedToken.id) {
    return response.status(403).json({ error: 'only the creator can delete the blog' });
  }

  // If everything is OK, delete the blog and respond with a success status code
  await Blog.findByIdAndRemove(blogId);
  response.status(204).end();
});


blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON())
})



module.exports = blogsRouter;
