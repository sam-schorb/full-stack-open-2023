import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN, CREATE_USER } from '../queries';

const LoginForm = ({ setToken, show, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerFavoriteGenre, setRegisterFavoriteGenre] = useState('');

  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
    onCompleted: ({ login }) => {
      const token = login.value;
      setToken(token);
      setPage('books');
      localStorage.setItem('library-user-token', token);
    },
  });

  const [createUser] = useMutation(CREATE_USER, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleRegister = async (event) => {
    event.preventDefault();
    
    try {
      await createUser({
        variables: {
          username: registerUsername,
          password: registerPassword,
          favoriteGenre: registerFavoriteGenre
        }
      });
      console.log('User registered successfully');
      // Optionally: Clear the registration form
      setRegisterUsername('');
      setRegisterPassword('');
      setRegisterFavoriteGenre('');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }


  const submit = async (event) => {
    event.preventDefault();

    login({ variables: { username, password } });
  };

  if (!show) {
    return null;
  }

  return (
    <div className="container">
      <form className="form" onSubmit={submit}>
        <div className="form-group">
          <label>username</label>
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div className="form-group">
          <label>password</label>
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
      <h2 className="heading">Register New User</h2>
      <form className="form" onSubmit={handleRegister}>
        <div className="form-group">
          <label>username</label>
          <input
            value={registerUsername}
            onChange={({ target }) => setRegisterUsername(target.value)}
          />
        </div>
        <div className="form-group">
          <label>password</label>
          <input
            type='password'
            value={registerPassword}
            onChange={({ target }) => setRegisterPassword(target.value)}
          />
        </div>
        <div className="form-group">
          <label>favorite genre</label>
          <input
            value={registerFavoriteGenre}
            onChange={({ target }) => setRegisterFavoriteGenre(target.value)}
          />
        </div>
        <button type='submit'>register</button>
      </form>
    </div>
  );
  }  

export default LoginForm;
