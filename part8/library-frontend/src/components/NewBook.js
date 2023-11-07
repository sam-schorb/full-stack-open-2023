import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_BOOK, GET_AUTHORS, GET_BOOKS } from '../queries';

const NewBook = (props) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [born, setBorn] = useState('');  // add this line


  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: GET_AUTHORS }],
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: GET_BOOKS });
      store.writeQuery({
        query: GET_BOOKS,
        data: {
          ...dataInStore,
          allBooks: [...dataInStore.allBooks, response.data.addBook],
        },
      });
      const dataInStoreAuthors = store.readQuery({ query: GET_AUTHORS });
      store.writeQuery({
        query: GET_AUTHORS,
        data: {
          ...dataInStoreAuthors,
          allAuthors: [...dataInStoreAuthors.allAuthors, response.data.addBook.author],
        },
      });
    },
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    
    createBook({
      variables: {
        title,
        author,
        born: parseInt(born),
        published: parseInt(published),
        genres,
      },
    });

    setTitle('');
    setPublished('');
    setAuthor('');
    setBorn(''); 
    setGenres([]);
    setGenre('');
    props.setPage('books');
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };
  return (
    <div className="container">
      <form className="form" onSubmit={submit}>
        <div className="form-group">
          <label>title</label>
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className="form-group">
          <label>author</label>
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div className="form-group">
          <label>born</label>
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <div className="form-group">
          <label>published</label>
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div className="form-group">
          <label>genre</label>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
}

export default NewBook