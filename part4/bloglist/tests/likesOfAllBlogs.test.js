const listHelper = require('../utils/list_helper')
const { initialBlogs } = require('./test_helper')

describe('total likes', () => {
    test('totalBlogLikes', () => {
      const result = listHelper.totalLikes(initialBlogs)
      expect(result).toBe(36)
    })
})
