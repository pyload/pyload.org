'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};
var yeomanConfig = {
    app: 'app',
    dist: 'dist',
    css: 'static/styles',
    js: 'static/scripts',
    img: 'static/images',
    fonts: 'static/fonts'
};

module.exports = function(grunt) {

    // Configuration
    grunt.initConfig({
        yeoman: yeomanConfig,

        watch: {
            less: {
                files: ['<%= yeoman.app %>/<%= yeoman.css %>/**/*.less'],
                tasks: ['less:server']
            },
            stageCss: {
                files: ['<%= yeoman.app %>/<%= yeoman.css %>/**/*.css'],
                tasks: ['copy:stageCss', 'autoprefixer:server']
            },
            jekyll: {
                files: ['<%= yeoman.app %>/**/*.{html,yml,md,mkd,markdown}',
                    '!<%= yeoman.app %>/bower_components'],
                tasks: ['jekyll:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '.jekyll/**/*.html',
                    '.tmp/<%= yeoman.css %>/**/*.css',
                    '{.tmp,<%= yeoman.app %>}/<%= js %>/**/*.js',
                    '<%= yeoman.app %>/<%= yeoman.img %>/**/*.{gif,jpg,jpeg,png,svg,webp}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // Change hostname to null to access the server from outside.
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, '.jekyll'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function(connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function(connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        // Running Jekyll also cleans all non-git files from the target directory
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: ['.tmp', '.jekyll']
        },
        less: {
            options: {
                paths: [yeomanConfig.app + '/_components', yeomanConfig.app + '/' + yeomanConfig.css]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/<%= yeoman.css %>',
                        src: '**/main.less',
                        dest: '.tmp/<%= yeoman.css %>',
                        ext: '.css'
                    }
                ]
            },
            server: {
                options: {
                    debugInfo: true,
                    lineNumbers: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/<%= yeoman.css %>',
                        src: '**/main.less',
                        dest: '.tmp/<%= yeoman.css %>',
                        filter: 'isFile',
                        ext: '.css'
                    }
                ]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/<%= yeoman.css %>',
                        src: '**/*.css',
                        dest: '<%= yeoman.dist %>/<%= yeoman.css %>'
                    }
                ]
            },
            server: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/<%= yeoman.css %>',
                        src: '**/*.css',
                        dest: '.tmp/<%= yeoman.css %>'
                    }
                ]
            }
        },
        jekyll: {
            // TODO: switch config to options style after
            // https://github.com/dannygarcia/grunt-jekyll/pull/14
            dist: {
                bundleExec: true,
                src: '<%= yeoman.app %>',
                dest: '<%= yeoman.dist %>',
                server: false,
                auto: false,
                config: '_config.yml,_config.build.yml'
            },
            server: {
                bundleExec: true,
                src: '<%= yeoman.app %>',
                dest: '.jekyll',
                server: false,
                auto: false,
                config: '_config.yml'
            }
        },
        jshint: {
            options: {
                jshintrc: '<%= yeoman.app %>/_components/pyload-common/.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '{.tmp,<%= yeoman.app %>}/<%= yeoman.js %>/**/*.js',
                'test/spec/**/*.js',
                '!<%= yeoman.app %>/<%= yeoman.js %>/vendor/**/*',
                '!<%= yeoman.app %>/_components/**/*'
            ],
            report: [
                '{.tmp,<%= yeoman.app %>}/<%= yeoman.js %>/**/*.js',
                '!<%= yeoman.app %>/<%= yeoman.js %>/vendor/**/*'
            ]
        },
        // UseminPrepare will only scan one page for usemin blocks. If you have
        // usemin blocks that aren't used in index.html, create a usemin manifest
        // page (hackery!) and point this task there.
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: '<%= yeoman.dist %>/index.html'
        },
        usemin: {
            options: {
                basedir: '<%= yeoman.dist %>',
                dirs: ['<%= yeoman.dist %>/**/*']
            },
            html: ['<%= yeoman.dist %>/**/*.html'],
            css: ['<%= yeoman.dist %>/**/*.css']
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeRedundantAttributes: true,
                    removeOptionalTags: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: '**/*.html',
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        // Usemin adds files to concat
        concat: {},
        // Usemin adds files to uglify
        uglify: {},
        // Usemin adds files to cssmin
        cssmin: {
            dist: {
                options: {
                    report: 'gzip'
                }
            }
        },
        imagemin: {
            dist: {
                options: {
                    progressive: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: '**/*.{jpg,jpeg,png}',
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: '**/*.svg',
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        src: [
                            '<%= yeoman.img %>/**/*',
                            '<%= yeoman.fonts %>/**/*'
                        ],
                        dest: '<%= yeoman.dist %>'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '.tmp',
                        src: [
                            '*.{ico,png}',
                            '<%= yeoman.img %>/**/*',
                            '<%= yeoman.fonts %>/**/*'
                        ],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            },
            // Stage assets in case we need them for concatination
            stageCss: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>/<%= yeoman.css %>',
                        src: '**/*.css',
                        dest: '.tmp/<%= yeoman.css %>'
                    }
                ]
            },
            stageJs: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>/<%= yeoman.js %>',
                        src: '**/*.js',
                        dest: '.tmp/<%= yeoman.js %>'
                    }
                ]
            },
            stageComponents: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>/_components/pyload-common',
                        src: '{images,fonts}/**/*',
                        dest: '.tmp/static'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/_components/pyload-common/images',
                        src: 'favicon.ico',
                        dest: '.tmp'
                    }
                ]
            }
        },
        rev: {
            options: {
                length: 4
            },
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/<%= yeoman.js %>/**/*.js',
                        '<%= yeoman.dist %>/<%= yeoman.css %>/**/*.css',
                        '<%= yeoman.dist %>/<%= yeoman.img %>/**/*.{gif,jpg,jpeg,png,svg,webp}'
                    ]
                }
            }
        },
        concurrent: {
            server: [
                'less:server',
                'copy:stageCss',
                'copy:stageComponents',
                'jekyll:server'
            ],
            dist: [
                'less:dist',
                'copy:stageCss',
                'copy:stageJs',
                'copy:stageComponents'
            ]
        }
    });

    // Load plugins
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Define Tasks
    grunt.registerTask('server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer:server',
            'connect:livereload',
            'watch'
        ]);
    });

    // No real tests yet. Add your own.
    // grunt.registerTask('test', [
    //   'clean:server',
    //   'concurrent:test',
    //   'connect:test'
    // ]);

    grunt.registerTask('report', [
        'clean:server',
        'less:server',
        'jshint:report'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        // Jekyll cleans all non-git files from the target directory, so must run first
        'jekyll:dist',
        'concurrent:dist',
        'copy:dist',
        'useminPrepare',
        'concat',
        'autoprefixer:dist',
        'cssmin',
//    'uglify',
        'imagemin',
        'svgmin',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'report',
        'build'
    ]);
};
