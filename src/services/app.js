import axios from '@/utils/request'

export const listPost = () => {
  return axios.get('/posts')
}

export const getUser = id => {
  return axios.get('/users/' + id)
}
