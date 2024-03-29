import config from '../config.json';

// borrowed from Redux example app https://github.com/reduxjs/redux-essentials-example-app/blob/master/src/api/client.js
// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper

// also some ideas on JWT tokens from https://jasonwatmore.com/post/2022/06/15/react-18-redux-jwt-authentication-example-tutorial 

let accessToken : string | null = null;

interface Headers {
  'Content-Type': string | null;
  Authorization: string | null;
};

function getAuthHeader(endpoint: string) : string {
  if(endpoint.includes(config.SERVER_URL)){
    if (accessToken) {
      return `Bearer ${accessToken}`;
    }
  }
  return '';
};

export async function client<T>(endpoint: string, isBlob: boolean, method: string, body?: T, ...customConfig: any) {

  const headers: Headers = {
    'Content-Type': 'application/json',
    Authorization: getAuthHeader(endpoint)
  };

  const config = {
    method: method,
    credentials: "include",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body)
  };

  let data
  try {
    const response = await window.fetch(endpoint, config)

    if(isBlob){
      data = await response.blob()
    }
    else {
      data = await response.json()
    }

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
};

client.get = function (endpoint: string, customConfig = {}) {
  return client(endpoint, false, 'GET', null, { ...customConfig })
};

client.getBlob = function (endpoint: string, customConfig = {}) {
  return client(endpoint, true, 'GET', null, { ...customConfig })
};

client.post = function <T>(endpoint: string, body: T, customConfig = {}) {
  return client(endpoint, false, 'POST', body, { ...customConfig })
};

client.put = function <T>(endpoint: string, body: T, customConfig = {}) {
  return client(endpoint, false, 'PUT', body, { ...customConfig })
};

client.delete = function (endpoint: string, customConfig = {}) {
  return client(endpoint, false, 'DELETE', null, { ...customConfig })
};

client.setAccessToken = function (token: string) {
  accessToken = token;
}