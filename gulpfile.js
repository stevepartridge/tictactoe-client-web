var config = {
  app: {
    name: 'App Name'
  },
  dest: 'www',

  src: 'src',

  minify_images: true,

  server: {
    host: '0.0.0.0',
    port: '8000'
  },

  data: {
    source: ''
  },

  api: {
    header: {
      api_key: 'Api-Key',
      auth_token: 'Auth-Token'
    },
    base_url: {
      local: 'http://localhost',
      staging: 'http://localhost',
      prod: 'http://localhost'
    }
  },

  connect: {
    local: {
      host: '127.0.0.1',
      port: '3033'
    }
  },

  live_reload: {
    port: 35729
  },

  weinre: {
    httpPort: 8001,
    boundHost: 'localhost',
    verbose: false,
    debug: false,
    readTimeout: 5,
    deathTimeout: 15
  }
};



var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  jade = require('gulp-jade'),
  less = require('gulp-less'),
  path = require('path'),
  livereload = require('gulp-livereload'), // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
  connect = require('gulp-connect'),
  prettify = require('gulp-html-prettify'),
  w3cjs = require('gulp-w3cjs'),
  gutil = require('gulp-util'),
  minifyCSS = require('gulp-minify-css'),
  gulpFilter = require('gulp-filter'),
  expect = require('gulp-expect-file'),
  gulpsync = require('gulp-sync')(gulp),
  imagemin = require('gulp-imagemin'),
  pngcrush = require('imagemin-pngcrush'),
  notify = require('gulp-notify'),
  growl = require('gulp-notify-growl'),
  jshint = require('gulp-jshint'),
  replace = require('gulp-replace'),
  inject = require('gulp-inject'),
  using = require('gulp-using'),
  del = require('del');

// production mode (see build task)
var isProduction = false;

// ignore everything that begins with underscore
var hidden_files = '**/_*.*';
var ignored_files = '!' + hidden_files;

var vendor = {
  // vendor scripts required to start the app
  base: {
    source: require('./src/vendor/vendor.base.json'),
    dest: config.dest + '/js',
    name: 'base.js'
  },
  // vendor scripts to make to app work. Usually via lazy loading
  app: {
    source: require('./src/vendor/vendor.json'),
    dest: config.dest + '/vendor'
  }
};

var source = {
  base: config.src + '/',
  scripts: {
    app: [
      config.src + '/js/*.js',
      config.src + '/js/**/*.js'
    ],
    base: config.src + '/js/',
    watch: [
      config.src + '/js/*.js',
      config.src + '/js/**/*.js'
    ]
  },
  views: {
      app: {
        files: [
          config.src + '/jade/index.jade',
          config.src + '/jade/**/*.jade'
        ],
      watch: [
        config.src + '/jade/index.jade',
        config.src + '/jade/**/*.jade',
        hidden_files
      ]
    }
  },
  styles: {
    app: {
      dir: 'less',
      main: [
        config.src + '/less/app.less'
      ],
      watch: [
        config.src + '/less/*.less',
        config.src + '/less/**/*.less'
      ]
    }
  },
  bootstrap: {
    main: config.src + '/less/bootstrap/bootstrap.less',
    dir: config.src + '/less/bootstrap',
    watch: [
      config.src + '/less/bootstrap/*.less'
    ]
  },
  images: {
    app: {
      files: [config.src + '/images/*', config.src + '/images/**/*'],
      dir: 'images',
      watch: [config.src + '/images/**/*']
    }
  },
};

var build = {
  scripts: {
    app: {
      main: 'app.js',
      dir: config.dest + '/js'
    }
  },
  styles: config.dest + '/css',
  views: {
    app: config.dest
  },
  images: {
    app: config.dest + '/images'
  }
};

// JS APP CLEAN
gulp.task('scripts:app:clean', function (cb) {
  console.log('build.scripts.app.dir', build.scripts.app.dir);
  del([
    build.scripts.app.dir + '/*',
    '!' + vendor.base.dest + '/' + vendor.base.name
  ], cb);
});
// JS APP
gulp.task('scripts:app', ['scripts:app:clean'], function () {
  // Minify, jshint and copy all JavaScript (except vendor scripts)
  return gulp.src(source.scripts.app, {
    base: source.scripts.base
  })

  // .pipe(replace('---APP_NAME---', config.app.name))


  .pipe(jshint('.jshintrc'))
    .pipe(notify(function (file) {
      if (file.jshint.success) {
        // Don't show something if success
        return false;
      }

      var errors = file.jshint.results.map(function (data) {
        if (data.error) {
          return '(' + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
      }).join('\n');
      return file.relative + ' (' + file.jshint.results.length + ' errors)\n' + errors;
    }))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(isProduction ? concat(build.scripts.app.main) : gutil.noop())

  .on('error', handleError)
    .pipe(isProduction ? uglify({
      preserveComments: 'some'
    }) : gutil.noop())
    .on('error', handleError)
    .pipe(gulp.dest(build.scripts.app.dir));
});

gulp.task('scripts:vendor', ['scripts:vendor:base', 'scripts:vendor:app']);

//  This will be included vendor files statically
gulp.task('scripts:vendor:base', function () {

  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(vendor.base.source)
    .pipe(expect(vendor.base.source))
    .pipe(uglify())
    .pipe(concat(vendor.base.name))
    .pipe(gulp.dest(vendor.base.dest));
});

// copy file from bower folder into the app vendor folder
gulp.task('scripts:vendor:app', function () {

  var jsFilter = gulpFilter(source.base + '**/*.js');
  var cssFilter = gulpFilter(source.base + '**/*.css');

  return gulp.src(vendor.app.source, {
      base: source.base + '/bower_components'
    })
    .pipe(expect(vendor.app.source))
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(minifyCSS())
    .pipe(cssFilter.restore())
    .pipe(gulp.dest(vendor.app.dest));

});

gulp.task('styles:app', function () {
  return gulp.src(source.styles.app.main)
    .pipe(less({
      paths: [source.styles.app.dir]
    }))
    .on('error', handleError)
    .pipe(isProduction ? minifyCSS() : gutil.noop())
    .pipe(gulp.dest(build.styles));
});

gulp.task('views:app', function () {
  console.log('views:app  --------> ', build.scripts.app.main);
  return gulp.src(source.views.app.files)

    .pipe(isProduction ?
     inject(
      gulp.src([config.src + '/js/' + build.scripts.app.main]), {
        starttag: '//- inject:{{ext}}',
        endtag: '//- endinject',
        ignorePath: config.src + '/',
        addRootSlash: false
      })
     :
     inject(
      gulp.src(source.scripts.app), {
        starttag: '//- inject:{{ext}}',
        endtag: '//- endinject',
        ignorePath: config.src + '/',
        addRootSlash: false
      }
    ))
    .pipe(jade())
    .on('error', handleError)
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2,
      unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u']
    }))

  // .pipe(htmlify({
  //     customPrefixes: ['ui-']
  // }))
  // .pipe(w3cjs( W3C_OPTIONS ))
  .pipe(gulp.dest(build.views.app))
    .pipe(using());
});

// nodemon
gulp.task('nodemon', function () {
  nodemon({
    script: false,
    watch: [
      config.src + '/images/*',
      config.src + '/js/*',
      config.src + '/jade/*',
      config.src + '/less/*',
      'server/*',
      'vendor/*',
      'gulpfile.js'
    ],
    ext: 'js jade less'
  })
    .on('start', ['start'])
    .on('change', function () {
      console.log('changed!');
    })
    .on('restart', function () {
      console.log('restarted!');
    });
});

gulp.task('images:app', function () {
  var stream = gulp.src(source.images.app.files)

  if (config.minify_images) {
    stream = stream.pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngcrush()]
    }))
  };

  return stream.pipe(gulp.dest(build.images.app));
});

gulp.task('connect', function () {
  if (typeof config.server === 'object') {
    connect.server({
      root: config.dest,
      host: config.server.host,
      port: config.server.port,
      livereload: true
    });
  } else {
    throw new Error('Connect is not configured');
  }
});


// Rerun the task when a file changes
gulp.task('watch', function () {
  livereload.listen();

  gulp.watch('./' + config.src + '/vendor/vendor.json', ['scripts:vendor:app']);
  gulp.watch('./' + config.src + '/vendor/**/*.js', ['scripts:vendor:app']);

  gulp.watch(source.scripts.watch, ['scripts:app']);
  gulp.watch(source.styles.app.watch, ['styles:app']);
  gulp.watch(source.bootstrap.watch, ['styles:app']); //bootstrap
  gulp.watch(source.views.app.watch, ['views:app']);
  gulp.watch(source.images.app.watch, ['images:app']);

  gulp.watch([

    config.dest + '/**'

  ]).on('change', function (event) {

    livereload.changed(event.path);
    connect.reload();

  });

});

// build for production (minify)
gulp.task('build', ['prod', 'prod:default']);
gulp.task('prod', function () {
  isProduction = true;
});

gulp.task('prod:default', gulpsync.sync([
    'scripts:vendor',
    'scripts:app',
    'styles:app',
    'views:app',
    'images:app',
  ]),
  function () {

    gutil.log(gutil.colors.cyan('******************'));
    gutil.log(gutil.colors.cyan('* Build Complete *'));
    gutil.log(gutil.colors.cyan('******************'));

  }
);

// default (no minify)
gulp.task('default', gulpsync.sync([
  'scripts:vendor',
  'scripts:app',
  'nodemon',
  'start'
]), function () {

  gutil.log(gutil.colors.cyan('************'));
  gutil.log(gutil.colors.cyan('* Done *'), 'Frolic freely amongst the files.');
  gutil.log(gutil.colors.cyan('************'));
});

gulp.task('start', [
  'styles:app',
  'views:app',
  'images:app',
  'connect',
  'watch'
]);

gulp.task('done', function () {
  console.log('Frolic freely amongst the files.');
});

// Error handler
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}