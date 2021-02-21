import React, { useState, useEffect } from 'react'
import { useQuery  } from '@apollo/client'

import { ALL_BOOKS, MYSELF } from './queries'

const Recommend = (props) => {
  const [genre, setGenre] = useState('')
  const [username, setUsername] = useState('')

  const resultBooks = useQuery(ALL_BOOKS, {
    variables: { genre }
  })

  const resultMe = useQuery(MYSELF, {
    onCompleted: (data) => {
      setGenre(data.me.favoriteGenre)
      setUsername(data.me.username)
    }
  })
  
  useEffect(() => {
    resultBooks.refetch()
  }, [genre]) // eslint-disable-line

  if (!props.show) { return null }

  if(resultBooks.loading || resultMe.loading) {
    return <div>loading books...</div>
  }

  const books = resultBooks.data.allBooks

  return (
    <div>
      <h2>Favorites ({genre}) of {username}</h2>
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
    </div>
  )

}

export default Recommend