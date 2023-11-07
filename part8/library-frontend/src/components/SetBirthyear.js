import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { SET_BIRTHYEAR, GET_AUTHORS } from '../queries';

const SetBirthyear = (props) => {
  const { loading, data } = useQuery(GET_AUTHORS);
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');
  const [setBirthyear] = useMutation(SET_BIRTHYEAR, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
    refetchQueries: [{ query: GET_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }

  if (loading) return <div>Loading...</div>;

  const authors = data?.allAuthors ?? [];

  const submit = (event) => {
    event.preventDefault();

    setBirthyear({
      variables: {
        name,
        setBornTo: parseInt(born),
      },
    });

    setName('');
    setBorn('');
  };
  return (
    <div className="container">
      <h2 className="heading">Set Birthyear</h2>
      <form className="form" onSubmit={submit}>
        <div className="form-group">
          <label>Author</label>
          <select value={name} onChange={({ target }) => setName(target.value)}>
            <option>Select author</option>
            {authors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>born</label>
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default SetBirthyear;
