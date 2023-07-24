export const listPost = () => {
  return req.get('/posts')
}

export const getUser = id => {
  return req.get('/users/' + id)
}
