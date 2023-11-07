const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }


const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
    return null
  }
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    const favorite = blogs.find(blog => blog.likes === maxLikes)
    
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }
  }

  const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    let authors = {};

    blogs.forEach(blog => {
        if (!authors[blog.author]) {
            authors[blog.author] = blog.likes;
        } else {
            authors[blog.author] += blog.likes;
        }
    });

    let maxLikes = 0;
    let popularAuthor = '';

    for (let author in authors) {
        if (authors[author] > maxLikes) {
            maxLikes = authors[author];
            popularAuthor = author;
        }
    }

    return {
        author: popularAuthor,
        likes: maxLikes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostLikes
}

