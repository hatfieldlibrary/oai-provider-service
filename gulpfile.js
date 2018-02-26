var gulp = require("gulp");
var ts = require("gulp-typescript");

gulp.task("build", function () {
    return gulp.src("server/**/*.ts")
        .pipe(ts({
            noImplicitAny: true,
            target: "es6",
            module: "commonjs",

        })).pipe(gulp.dest("dist"));
});

gulp.task("copy", function() {
    return gulp.src(".env")
        .pipe(gulp.dest("dist"));
});


