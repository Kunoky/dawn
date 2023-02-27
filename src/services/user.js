import axios from '@/utils/request'

export const login = user => {
  return axios.post('/login', user)
}
