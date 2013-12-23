/*
 * grunt-image-preload
 * https://github.com/lexich/grunt-image-preload
 *
 * Copyright (c) 2013 Efremov Alexey (lexich)
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    image_preload: {
      default_options: {
        options: {
          jsname:"PRELOADER",
          root:"http://example.com/"
        },
        files:[{
          cwd: "test/fixtures/images", 
          src: "**/*.{jpg,jpeg,png,gif}"
        }],        
        process:{
          files:[{
            cwd: "test/fixtures/",
            src: "index.html",
            dest: "tmp/"
          }]
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'image_preload', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
