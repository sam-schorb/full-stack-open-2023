import { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import SetBirthyear from './components/SetBirthyear';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recommendations';
const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(localStorage.getItem('library-user-token'));

  const logout = () => {
    setToken(null);
    localStorage.removeItem('library-user-token');
    setPage('authors');
  };

  return (
    <ApolloProvider client={client}>
      <div className='container mt-5'> {/* Margin added to the top */}
          <div className="mb-3"> {/* Margin added to the bottom */}
              <button className="btn btn-primary mr-2" onClick={() => setPage('books')}>books</button>
              <button className="btn btn-primary mr-2" onClick={() => setPage('authors')}>authors</button>
              {!token && <button className="btn btn-primary mr-2" onClick={() => setPage('login')}>login</button>}
              {token && (
                  <>
                      <button className="btn btn-primary mr-2" onClick={() => setPage('add')}>add book</button>
                      <button className="btn btn-primary mr-2" onClick={() => setPage('setBirthyear')}>set birthyear</button>
                      <button className="btn btn-primary mr-2" onClick={() => setPage('recommendations')}>recommendations</button>
                      <button className="btn btn-secondary" onClick={() => { setPage('login'); logout(); }}>logout</button>
                  </>
          )}
        </div>

        {page === 'authors' && <Authors show={true} />}
        {page === 'books' && <Books show={true} />}
        {token && page === 'add' && <NewBook show={true} setPage={setPage} />}
        {token && page === 'setBirthyear' && <SetBirthyear show={true} />}
        {!token && page === 'login' && <LoginForm setToken={setToken} setPage={setPage} show={true} />}
        {token && page === 'recommendations' && <Recommendations show={true} token={token} />}
      </div>
    </ApolloProvider>
  );
};



export default App;
