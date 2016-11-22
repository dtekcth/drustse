
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    babel: {
      options: {
        presets: ['babel-preset-es2015']
      },
      dist:{
        files:[{ // transpile all files in public/js
          expand: true,
          cwd: 'public/js',
          src: ['*.es6'],
          dest: 'public/js',
          ext: '.js'
        }]
      }
    },
    browserify: {
      options: {
        browserifyOptions: {
          standalone: 'verktyg'
        }
      },
      js:{
        src: ['public/js/verktyg.js'],
        dest: 'public/js/verktygBundle.js'
      }
    },
    sass: {
      options: {
        compress: true
      },
      compile: {
        files: {
          'public/stylesheets/layout.css' : 'public/stylesheets/layout.scss'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('default', ['babel', 'browserify', 'sass']);

};