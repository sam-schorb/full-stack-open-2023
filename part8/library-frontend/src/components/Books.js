import { useQuery } from '@apollo/client';
import { GET_BOOKS } from '../queries';
import { useState } from 'react';

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (!props.show) {
    return null;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  const books = data.allBooks;

  // Debug: Check for duplicated book IDs
  const bookIds = books.map(b => b.id);
  console.log('Book IDs:', bookIds);

  const genres = [...new Set(books.flatMap(book => book.genres).filter(Boolean))];

  
  // Debug: Check for duplicated genres after Set
  console.log('All Genres:', genres);


  return (
    <div className="container">
      <h2 className="heading">Books</h2>
      <table className="table">
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.filter(book => !selectedGenre || book.genres.includes(selectedGenre)).map((a) => (
            <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author ? a.author.name : 'Unknown'}</td>
                <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="genre-buttons">
            {genres.map(genre => (
                <button key={genre} onClick={() => setSelectedGenre(genre)}>
                    {genre}
                </button>
            ))}
            <button onClick={() => setSelectedGenre(null)}>All genres</button>
        </div>
    </div>
  )
}

export default Books;
