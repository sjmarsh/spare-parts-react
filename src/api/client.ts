// borrowed from Redux example app https://github.com/reduxjs/redux-essentials-example-app/blob/master/src/api/client.js
// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper

export async function client<T>(endpoint: string, method: string, body?: T, ...customConfig: any) {
    const headers = { 'Content-Type': 'application/json' }
  
    const config = {
      method: method,
      ...customConfig,
      headers: {
        ...headers,
        ...customConfig.headers,
      },
    }
  
    if (body) {
      config.body = JSON.stringify(body)
    }
  
    let data
    try {
      const response = await window.fetch(endpoint, config)
      data = await response.json()
      if (response.ok) {
        // Return a result object similar to Axios
        return {
          status: response.status,
          data,
          headers: response.headers,
          url: response.url,
        }
      }
      throw new Error(response.statusText)
    } catch (err: any) {
      return Promise.reject(err.message ? err.message : data)
    }
  }
  
  client.get = function (endpoint: string, customConfig = {}) {
    return client(endpoint, 'GET', null, { ...customConfig })
  }
  
  client.post = function<T> (endpoint: string, body: T, customConfig = {}) {
    return client(endpoint, 'POST', body, { ...customConfig })
  }

  client.put = function<T> (endpoint: string, body: T, customConfig ={}) {
    return client(endpoint, 'PUT', body, { ...customConfig })
  }

  client.delete = function (endpoint: string, customConfig ={}) {
    return client(endpoint, 'DELETE', null, { ...customConfig})
  }