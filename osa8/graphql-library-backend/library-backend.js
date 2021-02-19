require('dotenv').config()

const { ApolloServer, gql } = require('apollo-server')

const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')

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

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
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

      if(args.genre) {
        var books = await Book.find({
          genres: args.genre
        }).populate('author')
      } else {
        var books = await Book.find({}).populate('author')
      }

      if(!args.author) {
        return books
      }

      const booksByAuthor = books.filter(book =>
        book.author.name === args.author)

      return booksByAuthor
    },
    allAuthors: () => Author.find({})
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({}).populate('author')

      const booksByAuthor = books.filter(b => b.author.name === root.name)

      return booksByAuthor.length
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })

      if(!author) {
        const newAuthor = new Author({ name: args.author })
        await newAuthor.save()
        author = newAuthor
      }

      const book = new Book({ ...args, author: author })
      await book.save()

      return book
    },
    addAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if(author) {
        return null
      }

      const newAuthor = new Author({ name: args.name })
      newAuthor.save()

      return newAuthor
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })

      author.born = args.setBornTo

      await author.save()
      return author
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})