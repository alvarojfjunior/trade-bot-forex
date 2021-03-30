const axios = require('axios');

var baseURL = 'https://www.alphavantage.co';


const api = axios.create({
  baseURL: baseURL,
})


module.exports = {
  api
}