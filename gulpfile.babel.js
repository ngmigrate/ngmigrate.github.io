import gulp        from 'gulp';
import util        from 'gulp-util';
import concat      from 'gulp-concat';
import browserSync from 'browser-sync';
import child       from 'child_process';

const siteRoot = '_site';
const jekyllLogger = buffer => {
  buffer.toString().split(/\n/).forEach((message) => util.log('Jekyll: ' + message));
};

browserSync.create();

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);
  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });
});

gulp.task('default', ['jekyll', 'serve']);
