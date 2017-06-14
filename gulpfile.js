var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    gulpIf = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps'),
    isDevelopment = true,
    spritesmith = require("gulp.spritesmith"),
    browserSync = require('browser-sync').create();
gulp.task('sass', function() {
    return gulp.src('views/**/*.scss')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass())
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('publick/static/stylesheets'));
});
gulp.task('js_index', function(){
    return gulp.src(['views/main/choosing-car-form.js', 'views/main/cart.js', 'views/main/main_menu.js'])
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(concat('index.js'))
    .pipe(gulp.dest('publick/static/js'));
});
gulp.task('js_catalog', function(){
    return gulp.src(['views/catalog/catalog.js', 'views/main/main_menu.js', 'views/main/cart.js'])
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(concat('catalog.js'))
    .pipe(gulp.dest('publick/static/js'));
});
gulp.task('js_admin', function(){
    return gulp.src('views/admin/*.js')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(concat('admin.js'))
    .pipe(gulp.dest('publick/static/js'));
});
gulp.task('js_productCard', function(){
    return gulp.src(['views/main/main_menu.js', 'views/main/cart.js'])
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(concat('productCard.js'))
    .pipe(gulp.dest('publick/static/js'));
});
gulp.task('js_cart', function(){
    return gulp.src(['views/products_cart.js', 'views/main/main_menu.js', 'views/main/cart-count.js'])
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(concat('cart.js'))
    .pipe(gulp.dest('publick/static/js'));
});
gulp.task('js_succesfull_order', function(){
    return gulp.src('views/succesfull_order.js')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(concat('succesfull_order.js'))
    .pipe(gulp.dest('publick/static/js'));
});
gulp.task('js_main_search', function(){
    return gulp.src('views/main/main_menu.js')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(concat('main_search.js'))
    .pipe(gulp.dest('publick/static/js'));
});
gulp.task('js_static', function(){
    return gulp.src(['views/main/main_menu.js', 'views/main/cart-count.js'])
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(concat('static.js'))
    .pipe(gulp.dest('publick/static/js'));
});
gulp.task('js_error404', function(){
    return gulp.src(['views/main/main_menu.js'])
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(concat('error404.js'))
    .pipe(gulp.dest('publick/static/js'));
});
gulp.task('sprite_gen', function() {
  return gulp.src('publick/static/images/sprites/components_sprite/*.png').pipe(spritesmith({
    padding : 5,
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    algorithm: 'top-down',
    algorithmOpts: {sort: false}
  }))
    .pipe(gulp.dest('publick/static/images/sprites/'));
});

gulp.task('watch', function(){
    gulp.watch('views/**/*.scss', ['sass']);
    gulp.watch('publick/static/images/sprites/components_sprite/*.png', ['sprite_gen']);
    gulp.watch(['views/main/choosing-car-form.js', 'views/main/cart.js', 'views/main/popups.js', 'views/main/main_menu.js'], ['js_index']);
    gulp.watch(['views/catalog/catalog.js', 'views/main/main_menu.js', 'views/main/cart.js', 'views/main/popups.js'], ['js_catalog']);
    gulp.watch('views/admin/*.js', ['js_admin']);
    gulp.watch(['views/main/main_menu.js', 'views/main/cart.js', 'views/main/popups.js'], ['js_productCard']);
    gulp.watch(['views/products_cart.js', 'views/main/main_menu.js', 'views/main/cart-count.js'], ['js_cart']);
    gulp.watch('views/succesfull_order.js', ['js_succesfull_order']);
    gulp.watch('views/main/main_menu.js', ['js_main_search', 'js_error404']);
    gulp.watch(['views/main/main_menu.js', 'views/main/cart-count.js'], ['js_static']);
});

gulp.task('serve', function(){
    browserSync.init({
        proxy: "localhost:80"
    });
});

gulp.task('developing', ['watch', 'serve'], function (){
  // ...
});