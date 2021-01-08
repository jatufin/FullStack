import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'

import { loginUser } from '../reducers/userReducer'

import ReduxNotification from './ReduxNotification'


const LoginPage = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    dispatch(loginUser(username, password))
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>log in to application</h2>
      <ReduxNotification />
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            id='username'
            type='text'
            onChange={ ({ target }) => setUsername(target.value)}
          />
          <Form.Label>password:</Form.Label>
          <Form.Control
            id='password'
            type='password'
            onChange={ ({ target }) => setPassword(target.value)}
          />
          <Button variant='primary' id='login-button' type='submit'>login</Button>
        </Form.Group>
      </Form>
    </div>
  )
}
export default LoginPage