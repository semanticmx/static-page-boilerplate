/* eslint-disable import/no-extraneous-dependencies */
import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import webpack from 'webpack-stream';
import htmlmin from 'gulp-htmlmin';
import extname from 'gulp-extname';
import assemble from 'assemble';

import webpackConfig from './webpack.config.babel';

const app = assemble();

const paths = {
  allSrcJs: 'src/app/**/*.js',
  serverSrcJs: 'src/app/server/**/*.js?(x)',
  sharedSrcJs: 'src/app/shared/**/*.js?(x)',
  clientEntryPoint: 'src/app/client/app.js',
  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
};

gulp.task('load', (cb) => {
  app.partials('src/templates/partials/*.hbs');
  app.layouts('src/templates/layouts/*.hbs');
  app.pages('src/templates/pages/*.hbs');
  cb();
});

gulp.task('assemble', ['load'], () =>
  app.toStream('pages')
    .pipe(app.renderFile())
    .pipe(htmlmin())
    .pipe(extname())
    .pipe(app.dest('dist'))
);

gulp.task('build', ['lint'], () =>
  gulp.src([paths.allSrcJs])
    .pipe(babel())
    .pipe(gulp.dest('lib'))
);

gulp.task('lint', () =>
    gulp.src([
      paths.allSrcJs,
      paths.gulpFile,
      paths.webpackFile,
    ])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
);

gulp.task('main', ['lint', 'assemble'], () =>
  gulp.src(paths.clientEntryPoint)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist'))
);

gulp.task('watch', () => {
  gulp.watch(paths.allSrcJs, ['main']);
});

gulp.task('default', ['watch', 'main']);
