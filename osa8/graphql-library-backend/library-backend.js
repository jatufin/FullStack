require('dotenv').config()

const {
  ApolloServer,
  UserInputError, 
  AuthenticationError,
  PubSub,
  gql
} = require('apollo-server')

const pubSub = new PubSub()

const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const LibraryUser = require('./models/libraryuser')

const jwt = require('jsonwebtoken')
const JWT_SECRET=process.env.JWT_SECRET

let MONGODB_URI=process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB', error.message)
  })


const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    books: [Book!]!
    id: ID!
  }
  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type LibraryUser {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    allGenres: [String!]!
    me: LibraryUser
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    addAuthor(
      name: String!
    ): Author
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): LibraryUser
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if(!args.author && !args.genre) {
        return Book.find({}).populate('author')
      }

      if(!args.author) {
        const books = await Book.find({
          genres: args.genre
        }).populate('author')
        return books
      }

      const author = await Author.findOne({
        name: args.author
      })
      if(!author) {
        return []
      }

      if(!args.genre || args.genre === '') {
        const books = Book.find({
          author: author._id
        }).populate('author')
        return books
      }
      
      const books = Book.find({
        genres: args.genre,
        author: author._id
      }).populate('author')

      return books
    },
    allAuthors: () => Author.find({}),
    allGenres: async () => {
      const books = await Book.find({}).lean()

      let genres = {}
      for(let i=0; i < books.length; i++) {
        for(let j=0; j < books[i].genres.length; j++) {
          genres[books[i].genres[j]] = true
        }
      }

      return Object.keys(genres)
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      return root.books.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if(!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      let author = await Author.findOne({ name: args.author })

      if(!author) {
        const newAuthor = new Author({ name: args.author })
        await newAuthor.save()
        author = newAuthor
      }

      const book = new Book({ ...args, author: author })

      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }

      if(!author.books) {
        author.books = [book.id]
      } else {
        author.books = author.books.concat(book.id)
      }

      await author.save()

      pubSub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },
    addAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if(!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      
      const author = await Author.findOne({ name: args.name })
      if(author) {
        return null
      }

      const newAuthor = new Author({ name: args.name })
      
      try {
        await newAuthor.save()
      } catch (error) {
        throw new UserInputeError(error.message, {
          invalidArgs: args
        })
      }

      return newAuthor
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })

      author.born = args.setBornTo

      await author.save()
      return author
    },
    createUser: (root, args) => {
      const user = new LibraryUser({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })
  
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await LibraryUser.findOne({ username: args.username })
  
      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubSub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await LibraryUser
        .findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})