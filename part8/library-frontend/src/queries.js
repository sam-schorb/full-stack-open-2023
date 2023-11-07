import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
  query {
    allBooks {
      id
      title
      author {
        name
      }
      published
      genres
    }
  }
`;



export const GET_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!, $born: Int!) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
      born: $born
    ) {
      title
      author {
        name
        born
        bookCount
      }
      published
      genres
    }
  }
`;






export const SET_BIRTHYEAR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const CREATE_USER = gql`
  mutation createUser($username: String!, $password: String!, $favoriteGenre: String!) {
    createUser(username: $username, password: $password, favoriteGenre: $favoriteGenre) {
      id
      username
      favoriteGenre
    }
  }
`

export const GET_LOGGED_IN_USER = gql`
  query {
    me {
      favoriteGenre
    }
  }
`;