'use strict'

module.exports = (app, dirname) => {

  app.use('/api', require('./search'));

  app.get('/', function(req, res) {
    res.render('index.ejs', {});
  });
  app.get('/searchPage', function(req, res) {
    res.render('search.ejs');
  });
}
