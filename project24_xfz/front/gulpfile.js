var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cache = require('gulp-cache');
var image = require('gulp-imagemin');
var bs = require('browser-sync').create();
var sass = require('gulp-sass');
var util = require('gulp-util');
var source = require('gulp-sourcemaps');

path = {
    'html':'./templates/**/',
    'css':'./src/css/**/',
    'js':'./src/js/',
    'image':'./src/images/',
    'css_dist':'./dist/css/',
    'js_dist':'./dist/js/',
    'image_dist':'./dist/images/',
};
gulp.task('html',function () {
    gulp.src(path.html + '*.html')
        .pipe(bs.stream())
});

//定义处理css文件的任务
gulp.task('css',function () {
    gulp.src(path.css + '*.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(cssnano())
        .pipe(rename({'suffix':'.min'}))
        .pipe(gulp.dest(path.css_dist))
        .pipe(bs.stream())
});
//定义处理js文件的任务
gulp.task('js',function () {
    gulp.src(path.js + '*.js')
        .pipe(source.init())
        .pipe(uglify().on('error', util.log))
        .pipe(rename({'suffix':'.min'}))
        .pipe(source.write())
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream())
});
//定义处理图像的任务
gulp.task('image', function () {
    gulp.src(path.image + '*.*')
        .pipe(cache(image()))
        .pipe(gulp.dest(path.image_dist))
        .pipe(bs.stream())
});
//定义监听文件修改的任务
gulp.task('watch',function () {
    gulp.watch(path.html + '*.html',['html']);
    gulp.watch(path.css + '*.scss',['css']);
    gulp.watch(path.js + '*.js',['js']);
    gulp.watch(path.image + '*.*',['image']);
});
//初始化browser-sync的任务
gulp.task('bs',function () {
    bs.init({
        'server':{
            'baseDir':'./'
        }
    });
});
//创建一个默认任务
//前端开发使用browser-sync渲染的任务
// gulp.task('default',['bs','watch']);
//django渲染模版的默认任务
gulp.task('default',['watch']);
