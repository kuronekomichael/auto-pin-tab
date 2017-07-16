'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({

        // Project settings
        config: {
            app: 'app',
            dist: 'dist',
            manifest: grunt.file.readJSON('app/manifest.json')
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= config.dist %>/scripts/{,*/}*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            source: {
                files: [
                    '<%= config.app %>/*.html',
                    '<%= config.app %>/manifest.json',
                    '<%= config.app %>/scripts/{,*/}*.js',
                    '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['newer:copy']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            sass: {
                files: ['<%= config.app %>/styles/{,*/}*.scss'],
                tasks: ['compass']
            },
            styles: {
                files: ['<%= config.dist %>/styles/{,*/}*.css'],
                tasks: [],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.dist %>/*.html',
                    '<%= config.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= config.dist %>/manifest.json',
                    '<%= config.dist %>/_locales/{,*/}*.json'
                ]
            }
        },

        // Grunt server and debug server setting
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            chrome: {
                options: {
                    open: false,
                    base: [
                        '<%= config.dist %>'
                    ]
                }
            },
            test: {
                options: {
                    open: false,
                    base: [
                        'test',
                        '<%= config.dist %>'
                    ]
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            chrome: {
            },
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/scripts/{,*/}*.js',
                '!<%= config.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>/index.html']
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: [
                '<%= config.app %>/popup.html',
                '<%= config.app %>/options.html'
            ]
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
            },
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/styles/{,*/}*.css']
        },

        // The following *-min tasks produce minifies files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    // removeCommentsFromCDATA: true,
                    // collapseWhitespace: true,
                    // collapseBooleanAttributes: true,
                    // removeAttributeQuotes: true,
                    // removeRedundantAttributes: true,
                    // useShortDoctype: true,
                    // removeEmptyAttributes: true,
                    // removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>',
                    src: '*.html',
                    dest: '<%= config.dist %>'
                }]
            }
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //     dist: {
        //         files: {
        //             '<%= config.dist %>/styles/main.css': [
        //                 '<%= config.app %>/styles/{,*/}*.css'
        //             ]
        //         }
        //     }
        // },
        // uglify: {
        //     dist: {
        //         files: {
        //             '<%= config.dist %>/scripts/scripts.js': [
        //                 '<%= config.dist %>/scripts/scripts.js'
        //             ]
        //         }
        //     }
        // },
        // concat: {
        //     dist: {}
        // },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'images/{,*/}*.{webp,gif,png,jpg}',
                        '{,*/}*.html',
                        'scripts/{,*/}*.js',
                        'styles/{,*/}*.css',
                        'styles/fonts/{,*/}*.*',
                        '_locales/{,*/}*.json',
                    ]
                }]
            }
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            chrome: [
            ],
            dist: [
                'imagemin',
                'svgmin'
            ],
            test: [
            ]
        },

        // Auto buildnumber, exclude debug files. smart builds that event pages
        chromeManifest: {
            dist: {
                options: {
                    buildnumber: true,
                    background: {
                        target: 'scripts/background.js',
                        exclude: [
                            'scripts/chromereload.js'
                        ]
                    }
                },
                src: '<%= config.app %>',
                dest: '<%= config.dist %>'
            }
        },

        // compass/sass compile
        compass: {
            all: {
                options: {
                    sassDir: '<%= config.app %>/styles/',
                    cssDir: '<%= config.dist %>/styles/',
                    environment: 'production'
                }
            }
        },

        // Compres dist files to package
        compress: {
            dist: {
                options: {
                    archive: 'package/lock-tab-<%= config.manifest.version %>.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**'],
                    dest: ''
                }]
            }
        },

        // integration test on webdriver
        integration: {
            // http://localhost:3333/dist/options.html
            options: {
                program: 'node ./test-server/app.js'
            },
            src: ['test/integration/**/*.js']
        }

    });

    grunt.registerTask('debug', function () {
        grunt.task.run([
            'jshint',
            'concurrent:chrome',
            'connect:chrome',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'chromeManifest:dist',
        //'useminPrepare',
        //'concurrent:dist',
        //'cssmin',
        'compass',
        'concat',
        //'uglify',
        'copy',
        //'usemin'
    ]);

    grunt.registerTask('release', [
        'build',
        'compress'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
