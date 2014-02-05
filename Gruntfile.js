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
          jsvar:"PRELOADER",
          root:"../test/fixtures/images/"
        },
        files:[{
          cwd: "test/fixtures/images", 
          src: "**/*.{jpg,jpeg,png,gif}"
        }],        
        process:{
          files:[{
            cwd: "test/fixtures/",
            src: "*.html",
            dest: "tmp/"
          }]
        }
      },
      custom_options: {
        options: {
          jsvar:"PRELOADER",
          root:"../test/fixtures/images/",
          inlineLoad:"inline3.js",
          inlineFile:"tmp/inline3.js"
        },
        files:[{
          cwd: "test/fixtures/images", 
          src: "**/*.{jpg,jpeg,png,gif}"
        }],        
        process:{
          files:[{            
            cwd:"test/fixtures",
            src: "index.html",
            dest: "tmp/",
            rename:function(dest, filename, orig){              
              return dest + filename.replace("index.html","index3.html");
            }
          }]
        }
      },
      custom_options_2:{
        options: {
          jsvar:"PRELOADER2",
          root:"../test/fixtures/images/",
          inlineFile:"tmp/inline4.js"
        },
        files:[{
          cwd: "test/fixtures/images", 
          src: "**/*.{jpg,jpeg,png,gif}"
        }],
      },
    },    
    coffee:{
      dist:{
        options:{
          bare:true
        },
        files:{
          "tasks/image_preload.js":"tasks/image_preload.coffee"
        }  
      },
      template:{
        options:{
          bare:true
        },
        files:{          
          "template/inject.js":"template/inject.coffee"
        }  
      }
    },
    uglify:{
      dist:{
        files:{
          "template/inject.min.js":"template/inject.js"
        }
      }
    },
    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'clean:tests', 
    'coffee:template', 
    'uglify', 
    'image_preload', 
    'nodeunit'
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');

};
