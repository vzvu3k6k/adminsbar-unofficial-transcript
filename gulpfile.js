var gulp = require('gulp');
var gulpSass = require('gulp-sass');
var gulpRename = require('gulp-rename');
var gulpUtil = require('gulp-util');
var gulpWebserver = require('gulp-webserver');
var through = require('through2');
var srt = require('srt').fromString;
var marked = require('marked');
var jade = require('jade');

var paths = {
  transcripts: 'transcripts/*.srt',
  views: 'views/*',
  styles: 'styles/*',
  scripts: 'scripts/*'
};

gulp.task('pages', function(){
  return gulp.src(paths.transcripts)
    .pipe(through.obj(function(file, enc, cb){ // parse subriptext
      if(!file.isBuffer()){
        this.emit('error', new gulpUtil.PluginError('gulpfile.js', 'Only buffer is supported.'));
        return cb();
      }

      var subrip = srt(file.contents.toString());

      function msToTimecode(ms){
        function zeroFill(num, size){
          var s = num.toString();
          var l = size - s.length;
          for(var i = 0; i < l; i++){
            s = '0' + s;
          }
          return s;
        }

        var sec = ms / 1000;
        var timecode = [];
        for(var i = 0; i < 2 && sec >= 0; i++){
          sec = ~~(sec / Math.pow(60, i));
          timecode.push(zeroFill(sec % 60, 2));
        }
        return timecode.reverse().join(':') + '.' + zeroFill(ms % 1000, 3);
      }

      for(var i in subrip){
        // I prefer `data-start-time="00:01.000"` to `data-start-time="1000"` for human readability.
        subrip[i].startTime = msToTimecode(subrip[i].startTime);
        subrip[i].endTime = msToTimecode(subrip[i].endTime);

        subrip[i].text = marked(subrip[i].text).replace(/^<p>|<\/p>\s*$/g, '');
      }

      file.transcript = subrip;
      this.push(file);
      cb();
    }))
    .pipe(through.obj(function(file, enc, cb){ // metadata
      file.metadata = require(file.path.replace(/.\w+$/, '.json'));
      this.push(file);
      cb();
    }))
    .pipe(through.obj(function(file, enc, cb){ // html
      if(!file.isBuffer()){
        this.emit('error', new gulpUtil.PluginError('gulpfile.js', 'Only buffer is supported.'));
        return cb();
      }

      file.contents = new Buffer(jade.renderFile('views/transcript.jade', {
        transcript: file.transcript,
        metadata: file.metadata,
        cache: true,
        pretty: true
      }));
      this.push(file);
      cb();
    }))
    .pipe(gulpRename({
      extname: '.html'
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('scripts', function(){
  gulp.src(paths.scripts)
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('styles', function(){
  gulp.src(paths.styles)
    .pipe(gulpSass())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('watch', function() {
  gulp.watch(paths.transcripts, ['pages']);
  gulp.watch(paths.views, ['pages']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.styles, ['styles']);
});

gulp.task('webserver', function(){
  gulp.src('dist')
    .pipe(gulpWebserver({
      livereload: true
    }));
});

gulp.task('default', ['watch', 'pages', 'scripts', 'styles', 'webserver']);
