/*
 * grunt-simple-mocha
 * https://github.com/yaymukund/grunt-simple-mocha
 *
 * Copyright (c) 2012 Mukund Lakshman
 * Licensed under the MIT license.
 */
"use strict";

module.exports = function(grunt) {

  var path = require('path'),
      Mocha = require('mocha');

  grunt.registerMultiTask('simplemocha', 'Run tests with mocha', function() {

    var options = this.options(),
        mocha_instance = new Mocha(options);

    this.filesSrc.forEach(mocha_instance.addFile.bind(mocha_instance));

    // We will now run mocha asynchronously and receive number of errors in a
    // callback, which we'll use to report the result of the async task by
    // calling done() with the appropriate value to indicate whether an error
    // occurred.

    var done = this.async();

    // Grunt registers a handler for uncaught exceptions that
    // immediately fails the current task. However mocha also has its
    // own handler for uncaught exceptions that fails the current test
    // case which gets pre-empted by the grunt handlers.
    //
    // To handle this, temporarily remove any handlers and then
    // restore them when mocha is all done.
    var handlers = process.listeners('uncaughtException');
    process.removeAllListeners('uncaughtException');

    mocha_instance.run(function(errCount) {
      handlers.forEach(function(h) {
          process.on('uncaughtException', h);
      });

      if (errCount !== 0) {
          grunt.warn(errCount + "/" + mocha_instance.suite.total() + " tests failed.");
      }

      var withoutErrors = (errCount === 0);
      done(withoutErrors);
    });
  });
};
