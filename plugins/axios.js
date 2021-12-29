import axios from 'axios'

export default (context, inject) => {
  const responseSuccessHandler = response => {
    return response
  }

  const responseErrorHandler = async error => {
    try {
      if ([401, 403].includes(error.response.status)) {

        /*if (router.currentRoute.name != 'welcome') {
          if (error.response.status == 403) {
            await store.dispatch('logout')
          } else {
            await store.commit('logout')
          }
          window.location.replace('/');
        }*/
      }
    } catch (error) {
      console.error(error)
    } finally {
      return Promise.reject(error)
    }
  }

  function getUrl(url) {
    let baseUrl = process.env.BASE_URL
    if (!baseUrl.endsWith('/')) {
      baseUrl = `${baseUrl}/`
    }
    if (url.startsWith('/')) {
      url = url.substring(1)
    }
    return baseUrl + url
  }

  function _http(method, url, data, customConfig) {
    const _url = getUrl(url)
    let setting = {
      method,
      url: _url,
      uri: url
    }
    if ((typeof data === 'object' && Object.keys(data).length) || typeof data === 'object' && data.constructor.name === 'FormData') {
      setting.data = data
    }
    // Si en el store existe el token, entonces todas las peticiones adjuntaran el header Authorization
    if (context.store.state.token) {
      setting.headers = { 'Authorization': `Bearer ${context.store.state.token}` }
    }

    if (customConfig) {
      setting = { ...setting, ...customConfig }
    }
    return axios(setting).then(response => {
      let data = response.data
      return Promise.resolve(data)
    }).catch(error => {
      console.log('ver error', error)
      if (error.response) {
        let data = error.response.data
        return Promise.reject(data)
      }
    })
  }


  axios.interceptors.response.use(
    response => responseSuccessHandler(response),
    error => responseErrorHandler(error),
  )

  const Axios = {
    get: (url, config) => { return _http('get', url, undefined, config) },
    post: (url, data, config) => { return _http('post', url, data, config) },
    put: (url, data, config) => { return _http('put', url, data, config) },
    patch: (url, data, config) => { return _http('patch', url, data, config) },
    delete: (url, config) => { return _http('delete', url, data, config) },
  }

  inject('axios', Axios)
}


