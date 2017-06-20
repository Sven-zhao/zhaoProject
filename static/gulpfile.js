var gulp = require('gulp'),
	less = require('gulp-less'),
	rename = require('gulp-rename'),
	path = require('path'),
	minifyCSS = require('gulp-minify-css'),
	debug = require('gulp-debug'),
	argv = require('yargs').argv

/*
 * 编译各页面less文件到css文件
 * 将pagescript中每个页面的less文件生成css文件，
 * 放置到原less文件夹的平级文件夹内.即如下结构。
 * .
 * ├── css
 * │   └── main.css
 * └── less
 *     └── main.less
 */
gulp.task('less',function(obj){
	var filename = argv.f
	return gulp.src([
		'!**/pagescript/'+filename+'/{base,all}/**/less/*.less',
		'!**/pagescript/'+filename+'/**/less/main.less',
		'**/pagescript/'+filename+'/**/less/*.less',
	])
	.pipe(debug({title:"less: "}))
	.pipe(less({
		globalVars: {
			static: '"' + path.join(__dirname, '', 'wmp') + '"',
			staticurl: '"/static/wmp"'
		}
	}))
	.pipe(minifyCSS())
	.pipe(rename(function(path){
		path.dirname = path.dirname.replace('/less','/css')
		path.extname = '.css'
	})).pipe(gulp.dest(''))
})

//var requirejsOptimize = require('gulp-requirejs-optimize');
//gulp.task('default',function(){
//	return gulp.src('**/pagescript/**/js/main.js',{
//				base: 'static/wmp'
//			})
//			.pipe(requirejsOptimize(function(file){
//				var srcName = file.relative.replace('.js','');
//				var destName = file.relative.replace('main.js','main.min.js');
//				var conf = {
//					baseUrl: './static/wmp',
//					name: srcName ,
//					paths: {
//						pagescript: 'pagescript',
//						jquery: 'common/jquery/jquery-2.1.4.min'
//					}
//				}
//				console.log(conf);
//				return conf;
//			}))
//			.pipe(gulp.dest('dist'));
//});

/*



			.pipe(rename(function(path){
				console.log(path);
			}))
			.pipe(requirejsOptimize(function(file){
				var url = file.history[1].replace('','');
				console.log(url);
				return {
					baseUrl: './static/wmp',
					name: url,
					out: '',
					paths: {
						jquery: 'common/jquery/jquery-2.1.4.min'
					}
				};
			}))
			.pipe(gulp.dest('test2'));

*/
