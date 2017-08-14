'use strict'

const http = require('http'),
      FlightSearch = require('../models/flightSearch'),
      flight = new FlightSearch(),
      co = require('co'),
      _ = require('lodash'),
      config = require('config');

// Controller list of airports
exports.airportList = (req, res) => {
  let q = req.params.q ? req.params.q : "";
  co(function *() {
    let url = `${config.get("apiUrl.base")}${config.get("apiUrl.aiports")}?q=${q}`;
    let airportList = yield flight.getAPIresults(url);
    res.json({
      code:0,
      res:airportList
    });
  })
  .catch((err) => {
    res.json({
      code:1,
      msg:err,
      res:[]
    });
  });
}

// Controller list of Airlines
exports.searchAirline = (req, res) => {
  let q = req.params.q ? req.params.q : "";
  co(function *() {
    let url = `${config.get("apiUrl.base")}${config.get("apiUrl.airlines")}`;
    let airlineList = yield flight.getAPIresults(url);
    res.json({
      code:0,
      res:airlineList
    });
  })
  .catch((err) => {
    res.json({
      code:1,
      msg:err,
      res:[]
    });
  });
}

// Controller for flight search
exports.searchFlights = (req, res, next) => {
  let frm = req.query.frm,
      to = req.query.to,
      dt = req.query.dt ? req.query.dt.replace(/[/]/g,'-') : '',
      code = req.query.ac;
  co(function *() {
    let url = `${config.get("apiUrl.base")}${config.get("apiUrl.search")}/${code}/?date=${dt}&from=${frm}&to=${to}`;
    let flightList = yield flight.getAPIresults(url);
    flightList = _.sortBy(flightList, ['price', 'start.dateTime']);
    res.json({
      code:0,
      res:flightList
    });
  })
  .catch((err) => {
    res.json({
      code:1,
      msg:err,
      res:[]
    });
  });
};
