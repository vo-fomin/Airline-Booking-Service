module.exports = function(grunt) {
    var config = {
        pkg: grunt.file.readJSON('package.json'),

        browserify:     {
            options:      {

                transform:  [ require('brfs') ],
                browserifyOptions: {
                    //Папка з корнем джерельних кодів javascript
                    basedir: "Frontend/src/js/"
                }
            },

            flight: {
                src:        'Frontend/src/main.js',
                dest:       'Frontend/assets/js/main.js'
            }
        }
    };

    var watchDebug = {
        options: {
            'no-beep': true
        },
        scripts: {
            files: ['Frontend/src/**/*.js', 'Frontend/**/*.ejs'],
            tasks: ['browserify:flight']
        }
    };


    config.watch = watchDebug;
    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('default',
        [
            'browserify:flight'
        ]
    );

};