import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  BrowserRouter as Router,
  Switch, Route, Link, useRouteMatch
} from 'react-router-dom'

import { loadUsers } from '../reducers/usersReducer'

const Users = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users)

  useEffect(() => {
    dispatch(loadUsers())
  },[dispatch])

  const UserLink = ({ user }) => {
    const url = `/users/${user.id}`

    return (
      <Link to={url}>{user.name}</Link>
    )
  }

  const UsersTable = () => (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th />
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td><UserLink user={user} /></td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const User = () => {
    const match = useRouteMatch('/users/:id')
    const selectedUser = match
      ? users.find(u => u.id === match.params.id)
      : null

    if(!selectedUser) {
      return null
    }

    return (
      <div>
        <h1>{selectedUser.name}</h1>
        <h2>added blogs</h2>
        <ul>
          {selectedUser.blogs.map(blog => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    )
  }

  
  return (
    <Router>
      <Switch>
        <Route path='/users/:id'>
          <User />
        </Route>
        <Route path='/users'>
          <UsersTable />
        </Route>
      </Switch>
    </Router>
    
  )
}

export default Users