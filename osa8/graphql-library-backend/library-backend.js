require('dotenv').config()

const {
  ApolloServer,
  UserInputError, 
  AuthenticationError,
  gql
} = require('apollo-server')

const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

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
    id: ID!
  }
  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type User {
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
    me: User
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
    ): User
    login(
      username: String!
      password: String!
    ): Token
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

      // const authorId = '602c3cdad00b1b8441ae3855'

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
      const books = await Book.find({}).populate('author')

      const booksByAuthor = books.filter(b => b.author.name === root.name)

      return booksByAuthor.length
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
      const user = new User({ username: args.username })
  
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials")
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
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
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})