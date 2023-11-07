const listHelper = require('../utils/list_helper')
const initialBlogs = require('./test_helper')

// Call the mostLikes function
const result = listHelper.mostLikes(initialBlogs)

// Log the result
console.log(result)