import gulp        from 'gulp';
import util        from 'gulp-util';
import concat      from 'gulp-concat';
import header      from 'gulp-header';
import plumber     from 'gulp-plumber';
import babel       from 'gulp-babel';
import browserSync from 'browser-sync';
import child       from 'child_process';
import del         from 'del';
import fs          from 'fs';

const parsed = JSON.parse(fs.readFileSync('./package.json'));
const siteRoot = '_site';
const jekyllLogger = buffer => {
  buffer.toString().split(/\n/).forEach((message) => util.log(`Jekyll: ${message}`));
};

const banner = `
  /*! <%= parsed.name %> v<%= parsed.version %> | (c) ${new Date().getFullYear()} <%= parsed.author %> | <%= parsed.homepage %> */
`;

const paths = {
  scripts: '_scripts/*.js',
  libs: [
    'node_modules/linkjuice/dist/linkjuice.js'
  ]
};

browserSync.create();

gulp.task('clean', fn => del(`${siteRoot}/js/`));

gulp.task('scripts', ['clean'], () => {
  return gulp.src([...paths.libs, paths.scripts])
    .pipe(plumber())
    .pipe(concat('bundle.js'))
    .pipe(babel())
    .pipe(gulp.dest(`${siteRoot}/js/`));
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['serve', '--watch', '--incremental', '--drafts']);
  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [`${siteRoot}/**`],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });
});

gulp.task('watch', () => gulp.watch(paths.scripts, ['scripts']));

gulp.task('default', ['jekyll', 'serve', 'watch']);
