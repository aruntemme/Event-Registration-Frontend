import axios from 'axios'

const API_URL = 'http://localhost:3000'

const securedAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

const plainAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

securedAxiosInstance.interceptors.request.use(config => {
  const method = config.method.toUpperCase()
  if (method !== 'OPTIONS') {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${localStorage.jwt}`
    }
  }
  return config
})

securedAxiosInstance.interceptors.response.use(null, error => {
  if (
    error.response &&
    error.response.config &&
    error.response.status === 401
  ) {
    return plainAxiosInstance
      .post('/refresh', {}, { headers: { 'X-Refresh-Token': localStorage.refresh } })
      .then(response => {
        localStorage.refresh = response.data.refresh
        localStorage.jwt = response.data.access
        localStorage.signedIn = true

        const retryConfig = error.response.config
        retryConfig.headers['X-Refresh-Token'] = localStorage.refresh
        return plainAxiosInstance.request(retryConfig)
      })
      .catch(error => {
        console.log(error)
        delete localStorage.refresh
        delete localStorage.jwt
        delete localStorage.signedIn
        location.replace('/')
        return Promise.reject(error)
      })
  } else {
    return Promise.reject(error)
  }
})

export { securedAxiosInstance, plainAxiosInstance }
