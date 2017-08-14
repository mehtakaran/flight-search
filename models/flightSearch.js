'use strict'

const http = require('http');

class FlightSearch {

  getAPIresults(url) {
    return new Promise((resolve, reject) => {
      http.get(url, (response) => {
        let rawData = '';
        response.on('data', (chunk) => {
          rawData += chunk;
        });
        response.on('end', () => {
            try {
              let parsedData = JSON.parse(rawData.toString('utf-8'));
              resolve(parsedData);
            } catch (err) {
              reject(err);
            }
        });
      })
    })
  }
}

module.exports = FlightSearch;
