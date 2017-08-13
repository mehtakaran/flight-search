'use strict'

const config  = require('config'),
      Common  = require("./common"),
      http = require('http');

class Airport {
  constructor() {

  }

  airports(q) {
    return new Promise((resolve, reject) => {
      let url = `${config.get("apiUrl.base")}${config.get("apiUrl.aiports")}?q=${q}`;
      http.get(url, (response) => {
        var rawData = '';
        response.on('data', function(chunk) {
          rawData += chunk;
        });
        response.on('end', function() {
            try {
              var parsedData = JSON.parse(rawData.toString('utf-8'));
              resolve(parsedData);
            } catch (err) {
              reject(err);
            }
        });
      })
    })
  }

  airlines(q) {
    return new Promise((resolve, reject) => {
      let url = `${config.get("apiUrl.base")}${config.get("apiUrl.airlines")}`;
      http.get(url, (response) => {
        var rawData = '';
        response.on('data', function(chunk) {
          rawData += chunk;
        });
        response.on('end', function() {
            try {
              var parsedData = JSON.parse(rawData.toString('utf-8'));
              resolve(parsedData);
            } catch (err) {
              reject(err);
            }
        });
      })
    })
  }

  flights(code, dt, frm, to) {
    return new Promise((resolve, reject) => {
      let url = `${config.get("apiUrl.base")}${config.get("apiUrl.search")}/${code}/?date=${dt}&from=${frm}&to=${to}`;
      http.get(url, (response) => {
        var rawData = '';
        response.on('data', function(chunk) {
          rawData += chunk;
        });
        response.on('end', function() {
            try {
              var parsedData = JSON.parse(rawData.toString('utf-8'));
              resolve(parsedData);
            } catch (err) {
              reject(err);
            }
        });
      })
    })
  }
}

module.exports = Airport;
