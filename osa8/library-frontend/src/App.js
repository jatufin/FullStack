
import React, { useState } from 'react'

import {
  useApolloClient,
  useSubscription,
} from '@apollo/client'

import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import NewBook from './components/NewBook'
import Birthyear from './components/Birthyear'

import { BOOK_ADDED  } from './components/queries'

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const title = subscriptionData.data.bookAdded.title
      window.alert(`New book added: ${title}`)
    }
  })

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
        <button onClick={() => setPage('recommend')} style={!token ? {display: 'none'} : null}>recommend</button>
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

      <Recommend
        show={page === 'recommend'}
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