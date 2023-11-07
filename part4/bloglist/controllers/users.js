const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
  const body = req.body;

  // check if user with this username already exists
  const existingUser = await User.findOne({ username: body.username });
  if (existingUser) {
    return res.status(400).json({ error: 'username already exists' });
  }

  if (body.password.length < 3) {
    return res.status(400).json({ error: 'password is too short, should be at least 3 characters long' });
  }

  // Hash password using bcrypt
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
    blogs: body.blogs || []
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (exception) {
    res.status(500).json({ error: 'something went wrong...' });
  }
});

usersRouter.get('/', async (request, response) => {
    const users = await User
      .find({}).populate('blogs', {   title: 1, author: 1, url: 1, likes: 1 })
  
    response.json(users)
  })

module.exports = usersRouter