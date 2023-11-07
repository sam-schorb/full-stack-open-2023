// utils.js

const jwt = require('jsonwebtoken')
const User = require('./models/User')

const JWT_SECRET = process.env.JWT_SECRET;

const getUserFromToken = async (token) => {
  const decodedToken = jwt.verify(token, JWT_SECRET)
  if (!token || !decodedToken.id) {
    return null
  }

  const currentUser = await User.findById(decodedToken.id)
  return currentUser
}

module.exports = { getUserFromToken }
