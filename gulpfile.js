var gulp = require("gulp"),
  $ = require("gulp-load-plugins")(),
  source = require("vinyl-source-stream"), //allows consumption of (text) stream sources by gulp pipes
  browserify = require("browserify"), //allows code consuming require (commonjs, requirejs i.e. module loading) to be used in browsers
  watchify = require("watchify"), //watches for changes in modules using 
  babelify = require("babelify"); //adapter allowing browserify to use babel which transpiles es6 to es5
  path =  require("path");
  fs = require("fs");

gulp.task("scripts:server", () => {
  return gulp.src("./src-server/**/*.js")
    .pipe($.cached("server"))
    .pipe($.babel())
    .pipe(gulp.dest("./build"));
});

gulp.task("watch:scripts:server", gulp.series(
  "scripts:server",
  () => gulp.watch("./src-server/**/*.js", gulp.series("scripts:server"))
));

gulp.task("watch:scripts:client", () => {
   const files = fs.readdirSync("./src-client");
   for (let i=0; i < files.length; i++) {
     const file = files[i];
     if(path.extname(file) !== ".js")
       continue;

     initBundlerWatch(path.join("src-client", file));
   }

   return gulp.watch("./src-client/**/*.js")
     .on("change", initBundlerWatch);
});

gulp.task("watch:scripts", gulp.parallel(
  "watch:scripts:client",
  "watch:scripts:server"));

let bundlers = {};
function initBundlerWatch(file) {
  if(bundlers.hasOwnProperty(file))
   return;

  const bundler = createBundler(file);
  bundlers[file] = bundler;
  
  const watcher = watchify(bundler);
  const filename = path.basename(file);

   function bundle() {
     return bundler
       .bundle()
       .on("error", error => console.error(error))
       .pipe(source(filename))
       .pipe(gulp.dest("./public/build"));
   }

   watcher.on("update", bundle);
   watcher.on("time", time => console.log(`Built client in ${time} ms`))

   bundle();
}

function createBundler(file) {
  const bundler = browserify(file);
  bundler.transform(babelify);
  return bundler;
}



/*
How are they working? With browserify you create a single main.js
for each of your HTML pages and in it you declare its requirements
using require. You’ll then pass your main.js through browserify
and it will create a single file (e.g bundle.js) that contains
all the requirements (of course each requirement could have other
requirements - they’ll be automatically also included in the
resulting .js file). That’s the only file you need to put to the
script tag of your HTML! Using watchify, you can watch your main.js
for changes (the changes may also be in the files included from
main.js) and automatically generate the resulting bundle.js so that
you’ll just need to hit F5 to refresh and get the new version!

browserify not only concatenates your javascript libraries to a
single bundle but can also transform your coffeescript, typescript
, jsx etc files to javascript and then also add them to the bundle.
This is possible through a concept called transforms —
there are a lot of transforms (packages that transform an input
into a new output) that you can use. such as
vinyl-source-stream, babelify, etc*/
