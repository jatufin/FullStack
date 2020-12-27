import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)

  return response.data
}

const voteUp = async (anecdote) => {
  const url = `${baseUrl}/${anecdote.id}`

  const updatedAnecdote = {
    ...anecdote,
    votes: anecdote.votes + 1
  }
  delete updatedAnecdote.id

  const response = await axios.put(url, updatedAnecdote)

  return response.data
}

export default {
  getAll,
  createNew,
  voteUp
}