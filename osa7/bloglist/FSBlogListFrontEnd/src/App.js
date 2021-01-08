import React, { useEffect } from 'react'

import LoginPage from './components/LoginPage'
import MainPage from './components/MainPage'

import { useDispatch, useSelector } from 'react-redux'
import { initBlogs } from './reducers/blogReducer'
import { returnSession } from './reducers/userReducer'



const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initBlogs())
    dispatch(returnSession())
  }, [dispatch])

  /*
  if(user === null) {
    return(
      <div className='container'>
        <LoginPage />
      </div>
    )
  }
  */

  return (
    <div className='container'>
      {user === null
       ? <LoginPage />
       : <MainPage />
      }
    </div>
  )
}

export default App