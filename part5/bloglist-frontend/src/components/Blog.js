import { useState } from 'react'

const Blog = ({ blog, handleDelete, handleLike }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetailsVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }

  return (
    <tr>
      <td>{blog.title}</td>
      <td style={{ display: detailsVisible ? '' : 'none' }}>{blog.author}</td>
      <td style={{ display: detailsVisible ? '' : 'none' }}>{blog.url}</td>
      <td style={{ display: detailsVisible ? '' : 'none' }}>{blog.likes}</td>
      <td>
        <button onClick={toggleDetailsVisibility}>
          {detailsVisible ? 'Hide' : 'Show'}
        </button>
        <button onClick={() => handleLike(blog.id)}>Like</button>
        <button onClick={() => handleDelete(blog.id)}>Delete</button>
      </td>
    </tr>
  )
}

export default Blog