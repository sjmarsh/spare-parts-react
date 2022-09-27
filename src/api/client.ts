import { store } from '../app/store';

import config from '../config.json';

// borrowed from Redux example app https://github.com/reduxjs/redux-essentials-example-app/blob/master/src/api/client.js
// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper

// also some ideas on JWT tokens from https://jasonwatmore.com/post/2022/06/15/react-18-redux-jwt-authentication-example-tutorial 

interface Headers {
  'Content-Type': string | null;
  Authorization: string | null;
}

function getAuthHeader(endpoint: string) {
  if(endpoint.includes(config.SERVER_URL)){
    
    const authenticationResponse = store.getState().login.authenticationResponse;
    
    if (authenticationResponse && authenticationResponse.accessToken) {
      return `Bearer ${authenticationResponse.accessToken}`;
    }
  }
  return '';
}

export async function client<T>(endpoint: string, method: string, body?: T, ...customConfig: any) {

  const headers: Headers = {
    'Content-Type': 'application/json',
    Authorization: getAuthHeader(endpoint)
  }

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

client.post = function <T>(endpoint: string, body: T, customConfig = {}) {
  return client(endpoint, 'POST', body, { ...customConfig })
}

client.put = function <T>(endpoint: string, body: T, customConfig = {}) {
  return client(endpoint, 'PUT', body, { ...customConfig })
}

client.delete = function (endpoint: string, customConfig = {}) {
  return client(endpoint, 'DELETE', null, { ...customConfig })
}