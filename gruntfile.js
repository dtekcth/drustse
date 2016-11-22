
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
    }
  });

  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask('default', ['babel']);

};