'use strict'

const router = require('express').Router(),
      fltObj  = require('../controllers/flightController.js');

router.get('/list-of-airports/:q', fltObj.airportList);
router.get('/list-of-airlines', fltObj.searchAirline);
router.get('/search-flights', fltObj.searchFlights);

module.exports = router;
