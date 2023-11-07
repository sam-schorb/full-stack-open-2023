const listHelper = require('../utils/list_helper')
const { initialBlogs } = require('./test_helper')


describe('favorite blog', () => {
  const blogs =  initialBlogs

  test('finds out which blog has the most likes', () => {
    const expected = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(expected)
  })
})
