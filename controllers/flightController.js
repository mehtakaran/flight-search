'use strict'

const http = require('http'),
      Airport = require('../models/flightSearch'),
      airport = new Airport(),
      co = require('co');

// Controller list of airports
exports.airportList = (req, res) => {
  let q = req.params.q ? req.params.q : "";
  co(function *() {
    let airportList = yield airport.airports(q);
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
    let airportList = yield airport.airlines(q);
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

// Controller for flight search
exports.searchFlights = (req, res, next) => {
  let frm = req.query.frm,
      to = req.query.to,
      dt = req.query.dt ? req.query.dt.replace(/[/]/g,'-') : '',
      code = req.query.ac;
  co(function *() {
    let airportList = yield airport.flights(code, dt, frm, to);
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
};
