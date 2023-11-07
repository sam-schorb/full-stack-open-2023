const listHelper = require('../utils/list_helper')
const { initialBlogs } = require('./test_helper')

describe('blog with most likes', () => {
  const blogs = initialBlogs
  
    test('mostLikes', () => {
      const expected = {
        author: "Edsger W. Dijkstra",
        likes: 17
      };
      const result = listHelper.mostLikes(blogs);
      expect(result).toEqual(expected);
    });
  });
  