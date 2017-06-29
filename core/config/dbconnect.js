/*
 *  core dbconnect.js
 *  package: /core/config
 *  Use:
 *     Exporta una instancia de la conexion a la base de datos
 */

/**
 * Database connection
 */
/**
 * Load module dependencies
 */
var mongoose = require('mongoose');
var BBPromise = require('bluebird');
var debug = require('debug')('develar:server');

var db;
// Connect to MongoDB database

module.exports = function(settings){
  mongoose.connect(settings.dbase);
  mongoose.Promise = BBPromise;
  
  db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  db.on('open', function(){
  	console.log('mongodb connected ok');
    debug('MongoDB: connected OK');
  });

  return mongoose;
};
