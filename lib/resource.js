/**
 * @file 内建资源处理方法集合
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com],
 *         ostream[ostream.song@gmail.com],
 *         firede[firede@firede.us],
 *         junmer[junmer@foxmail.com],
 *         leeight[leeight@gmail.com],
 *		   hades[denghongqi@gmail.com]
 */

var fs = require('fs');
var path = require('path');
var camel = require('to-camel-case');

var dirpath = path.resolve(__dirname, './handlers');
var files = fs.readdirSync(dirpath);

files.forEach(function(file) {
    if (!/\.js$/.test(file)) {
        return ;
    }

    var name = camel(file.replace(/\.js$/, ''));
    var filepath = path.resolve(__dirname, './handlers', file);
    exports[name] = require(filepath);
});
