import React from 'react'

import {
  BrowserRouter as Router,
  Switch, Route, Link
} from 'react-router-dom'

import Users from './Users'
import BlogsPage from './BlogsPage'
import ReduxNotification from './ReduxNotification'

import { useDispatch, useSelector } from 'react-redux'
import { logoutUser} from '../reducers/userReducer'

import { Button } from 'react-bootstrap'


const MainPage = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const handleLogout = async () => {
    dispatch(logoutUser())
  }

  const CurrentUser = () => (
    <span>
      {user.name} logged in&nbsp;
      <Button id='logout-button' onClick={() => {handleLogout()}}>logout</Button>  
    </span>
  )

  const padding = {
    padding: 5
  }

  return (
    <div>
      <ReduxNotification />
      <Router>
        <div className='navigation'>
          <Link style={padding} to='/'>blogs</Link>
          <Link style={padding} to='/users'>users</Link>
          <CurrentUser />
        </div>
        <h2>blog app</h2>
        <Switch>
          <Route path ='/blogs/:id'>
            <BlogsPage />
          </Route>
          <Route path ='/users'>
            <Users />
          </Route>
          <Route path='/'>
            <BlogsPage />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default MainPage
