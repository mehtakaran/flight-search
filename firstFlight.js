const express   = require('express'),
      app       = express(),
      server    = require('http').createServer(app),
      appUse    = require('./config/appConfig'),
      appRoutes = require('./routes'),
      cluster   = require('cluster'),
      numCPUs   = require('os').cpus().length,
      ejs       = require('ejs');

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// }
// else {
  appUse(app, __dirname);
  appRoutes(app, __dirname);
  // console.log(`Worker ${process.pid} started`);
// }
