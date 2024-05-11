import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/', // Replace with your API base URL
  timeout: 10000, // Adjust timeout as needed
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS'
  }
});

export default instance;