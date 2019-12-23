import axios from 'axios';

import * as storage from '../utils/storage';

declare global {
  interface Window {
    RUNTIME_APP_GRAPHQL_URI?: string;
    RUNTIME_APP_API_URL?: string;
  }
}

const serverBaseUrl = window.RUNTIME_APP_API_URL
  ? window.RUNTIME_APP_API_URL
  : process.env.REACT_APP_API_URL;
const graphqlServerBaseUrl = window.RUNTIME_APP_GRAPHQL_URI
  ? window.RUNTIME_APP_GRAPHQL_URI
  : process.env.REACT_APP_GRAPHQL_URI;
axios.defaults.headers.common['Authorization'] =
  'Bearer ' + storage.get('token_id');
const headers = () => {
  return {
    Authorization: 'Bearer ' + storage.get('token_id'),
    'Content-Type': 'application/json'
  };
};

const Downloadheaders = () => {
  return {
    Authorization: 'Bearer ' + storage.get('token_id'),
    'Content-Type': 'application/json',
    'Response-Type': 'blob'
  };
};

export function graphqlPost(url: string, data: object, config: object) {
  const conf = {
    headers: {
      ...headers()
    },
    ...config
  };
  return axios.post(graphqlServerBaseUrl + url, data, conf);
}

export function httpPost(url: string, data: object, config: object) {
  const conf = {
    headers: {
      ...headers()
    },
    ...config
  };
  return axios.post(serverBaseUrl + url, data, conf);
}

export function httpGet(url: string, config: object) {
  const conf = {
    headers: {
      ...headers()
    },
    ...config
  };
  return axios.get(serverBaseUrl + url, conf);
}

export function httpPatch(url: string, data: object, config: object) {
  const conf = {
    headers: {
      ...headers()
    },
    ...config
  };
  return axios.patch(serverBaseUrl + url, data, conf);
}

export function httpPut(url: string, data: object, config: object) {
  const conf = {
    headers: {
      ...headers()
    },
    ...config
  };
  return axios.put(serverBaseUrl + url, data, conf);
}

export function httpDelete(url: string, config: object) {
  const conf = {
    headers: {
      ...headers()
    },
    ...config
  };
  return axios.delete(serverBaseUrl + url, conf);
}

export function httpDownloadFile(url: string, data: object, config: object) {
  const conf = {
    headers: {
      ...Downloadheaders()
    },
    ...config
  };
  return axios.post(serverBaseUrl + url, data, conf);
}

// Updated implementation

const axiosInstance = axios.create({
  baseURL: window.RUNTIME_APP_API_URL || process.env.REACT_APP_API_URL
});

axiosInstance.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${storage.get('token_id')}`;
  config.headers.ContentType = 'application/json';
  return config;
});

axiosInstance.interceptors.response.use(
  success => success,
  error => {
    console.error(error && error.response);
    return Promise.reject(error && error.response);
  }
);

export const api = axiosInstance;
export default api;
