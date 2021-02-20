
import React, { useState } from 'react'

import { useApolloClient } from '@apollo/client'

import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Birthyear from './components/Birthyear'

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const Buttons = () => (
    <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('login')} style={token ? {display: 'none'} : null}>login</button>
        <button onClick={() => setPage('add')} style={!token ? {display: 'none'} : null}>add book</button>
        <button onClick={() => setPage('birthyear')} style={!token ? {display: 'none'} : null}>set birthyear</button>
        <button onClick={() => logout()} style={!token ? {display: 'none'} : null}>logout</button>
    </div>
  )
  return (
    <div>
      <Buttons />

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <LoginForm
        setToken={setToken}
        returnPage={() => setPage('authors')}
        show={page === 'login'}
      />

      <NewBook
        show={page === 'add'}
      />

      <Birthyear
        show={page === 'birthyear'}
      />

    </div>
  )
}

export default App