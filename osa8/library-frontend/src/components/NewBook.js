import React, { useState } from 'react'

import { useMutation, useQuery } from '@apollo/client'

import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS, ALL_GENRES } from './queries'

const NewBook = (props) => {
  // Needed to refetch the queries
  const [allGenres, setAllGenres] = useState([])

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const resultGenres = useQuery(ALL_GENRES, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setAllGenres(data.allGenres)
    }
  })

  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: () => {
      resultGenres.refetch()

      let queryArray = [
      { query: ALL_AUTHORS },
      { query: ALL_GENRES },
      { query: ALL_BOOKS },
      {
        query: ALL_BOOKS,
        variables: { genre: ''}
      } ]
    
      for(let i=0; i < allGenres.length; i++) {
        const query = {
          query: ALL_BOOKS,
          variables: { genre: allGenres[i]}
        }
        queryArray.push(query);
      }

      return queryArray
    },
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }
  })

  if (!props.show) {
    return null
  }

  if(resultGenres.loading) {
    return <div>loading genres...</div>
  }

  const submit = async (event) => {
    event.preventDefault()
    
    // console.log('add book...')

    createBook({ variables: { title: title, author: author, published: parseInt(published), genres }})
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook