var fs = require('fs');
var path = require('path');
var prjroot = fs.realpathSync(path.join(__dirname, '..'));

var browserify = require('browserify-middleware');
//var lessMiddleware = require('less-middleware');
var sassMiddleware = require('node-sass-middleware');
var express = require('express');

var app = express();

app.use(sassMiddleware({
    src: '/themes/default/src/scss',
    dest: '/themes/default/css',
    root: prjroot,
    debug: false,
    outputStyle: 'compressed'
}));

//app.use(lessMiddleware('/themes/default/src/less', {
//    debug: false,
//    dest : '/themes/default/css',
//    pathRoot: prjroot
//}));

var jsfiles = ['main'];
for( var i in jsfiles){
    var f  = jsfiles[i];
    var key = __dirname + '/default/src/js/' + f + '.js';
    var module = {};
    module[key] = {expose: f};
    app.get('/themes/default/js/' + f + '.js', browserify([module],{
        external:'jquery'
    }));
}

app.use('/themes/default/css', express.static(prjroot + '/themes/default/css'));

app.listen(8889);
