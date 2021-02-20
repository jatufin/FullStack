import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'

import { ALL_BOOKS, ALL_GENRES } from './queries'

const Books = (props) => {
  
  const resultGenres = useQuery(ALL_GENRES)
 
  // const [books, setBooks] = useState([])
  const [genre, setGenre] = useState('')
  const [queryBooks, resultBooks] = useLazyQuery(ALL_BOOKS, {
    variables: { genre }
  })

  useEffect(() => {
    queryBooks()
  }, [queryBooks])

  if (!props.show) { return null }

  if(resultBooks.loading || resultGenres.loading) {
    return <div>loading books...</div>
  }

  const books = resultBooks.data.allBooks
  const genres = resultGenres.data.allGenres

  const GenreButtons = () => (
    <div>
      {genres.map(g =>
        <button key={g} onClick={() => setGenre(g)}>{g}</button>
      )}
      <button onClick={() => setGenre('')}>all books</button>
    </div>
  )
  return (
    <div>
      <h2>books</h2>

      {resultBooks.loading ? 'loading books ...' : ''}
      {genre ? `Genre: ${genre}` : 'All books'}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <GenreButtons />
    </div>
  )
}

export default Books