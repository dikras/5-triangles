const {src, dest, series, watch} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const del = require('del');
const sync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');
const postcss = require("gulp-postcss");
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');

function html() {
  return src('src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('build'));
}

function css() {
  return src('src/sass/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(concat('style.css'))
    .pipe(rename('style.min.css'))
    .pipe(dest('build/css'))
}

function clean() {
  return del('build');
}

function serve() {
  sync.init({
    server: 'build/'
  })

  watch('src/*.html', series(html)).on('change', sync.reload);
  watch('src/sass/**/*.scss', series(css)).on('change', sync.reload);
}

function copy() {
  return src([
    'src/fonts/**',
    'src/img/**',
    'src/js/**'
  ], {
    base: 'src'
  })
  .pipe(dest('build'));
};

exports.start = series(clean, copy, css, html, serve);