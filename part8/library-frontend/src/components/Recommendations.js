import { useQuery } from '@apollo/client';
import { GET_BOOKS, GET_LOGGED_IN_USER } from '../queries';

const Recommendations = ({ show, token }) => {
  // First, fetch user data
  const { data: userData, loading: userLoading } = useQuery(GET_LOGGED_IN_USER, {
    skip: !token
  });

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
    }

  const userFavoriteGenre = userData?.me?.favoriteGenre || 'DefaultGenre';

  // Then, fetch the books
  const { data } = useQuery(GET_BOOKS, {
    skip: userLoading || !userFavoriteGenre
  });

  const books = data?.allBooks.filter(book => book.genres.map(g => g.trim().toLowerCase()).includes(userFavoriteGenre.trim().toLowerCase())) || [];

  return (
    <div className="container">
      <h2 className="heading">Recommendations</h2>
      <p>Books in your favourite genre <b>{capitalizeFirstLetter(userFavoriteGenre)}</b></p>
      <table className="table">
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author ? a.author.name : 'Unknown'}</td>
                <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations;
