const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server');
const { GraphQLError } = require('graphql');
const mongoose = require('mongoose');
const { getUserFromToken } = require('./utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Book = require('./models/Book');
const Author = require('./models/Author');
const User = require('./models/User');
require('dotenv').config();

mongoose.set('strictQuery', true);

const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

console.log(`JWT Secret: ${JWT_SECRET}`);
console.log(`MongoDB URI: ${MONGODB_URI}`);

if (!JWT_SECRET || !MONGODB_URI) {
    console.error('Missing necessary environment variables. Check your .env file.');
    process.exit(1);
}

console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message);
    });

const typeDefs = gql`
    type Author {
        name: String!
        id: ID!
        born: Int
        bookCount: Int
    }

    type Book {
        title: String
        published: Int
        author: Author
        id: ID
        genres: [String!]
    }

    type User {
        username: String!
        favoriteGenre: String!
        id: ID!
    }

    type Token {
        value: String!
    }


      type Mutation {
        addBook(
            title: String!
            published: Int!
            author: String!
            born: Int!
            genres: [String!]!
        ): Book
        editAuthor(
            name: String!
            setBornTo: Int!
        ): Author
        createUser(
            username: String!
            password: String!
            favoriteGenre: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
        me: User
    }
`;

const resolvers = {
    Query: {
        me: (root, args, context) => {
            return context.currentUser;
        },
        bookCount: () => Book.collection.countDocuments(),
        authorCount: () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            if (!args.author && !args.genre) {
                return Book.find({}).populate('author');
            }
            let filteredBooks = await Book.find({}).populate('author');
            if (args.author) {
                filteredBooks = filteredBooks.filter(book => book.author.name === args.author);
            }
            if (args.genre) {
                filteredBooks = filteredBooks.filter(book => book.genres.includes(args.genre));
            }
            return filteredBooks;
        },
        allAuthors: async () => {
          try {
            const authors = await Author.find({});
            return authors;
          } catch (error) {
            console.error("Error in fetching authors: ", error);
            return [];
          }
        },
            },
    Mutation: {
        createUser: async (root, args) => {
            const existingUser = await User.findOne({ username: args.username });
            if (existingUser) {
                throw new UserInputError('Username is already taken.');
            }
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(args.password, saltRounds);
            const user = new User({ ...args, passwordHash });

            try {
                await user.save();
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                });
            }

            return user;
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });

            const passwordCorrect = user === null
                ? false
                : await bcrypt.compare(args.password, user.passwordHash);

            if (!(user && passwordCorrect)) {
                throw new UserInputError("wrong credentials");
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            };

            return { value: jwt.sign(userForToken, JWT_SECRET) };
        },
        addBook: async (root, args, context) => {
          const currentUser = context.currentUser;

          if (!currentUser) {
              throw new AuthenticationError("not authenticated");
          }

          let author = await Author.findOne({ name: args.author });

          // If the author does not exist, create a new author.
          if (!author) {
              author = new Author({ name: args.author, born: args.born });

              try {
                  await author.save();
              } catch (error) {
                  throw new UserInputError(error.message, { invalidArgs: args });
              }
          }

          // After validating the author, create a new book entry in the database.
          const book = new Book({ ...args, author: author._id });

          try {
              await book.save();
          } catch (error) {
              throw new UserInputError(error.message, { invalidArgs: args });
          }

          // Update the author's book list
          author.books = author.books.concat(book._id);
          await author.save();

          // Populate the author field in the book document before returning it
          return Book.populate(book, 'author');
      },

        editAuthor: async (root, args, context) => {
            const author = await Author.findOne({ name: args.name });
            if (!author) {
                throw new UserInputError('Author does not exist.');
            }
            author.born = args.setBornTo;
            try {
                await author.save();
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                });
            }
            return author;
        },
    },
    Author: {
      bookCount: async (root) => {
        return await Book.countDocuments({ author: root.id });
      },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodedToken = jwt.verify(
                auth.substring(7), JWT_SECRET
            );
            const currentUser = await User.findById(decodedToken.id);
            return { currentUser };
        }
    },
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
