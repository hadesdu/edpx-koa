var fs = require('fs');
var path = require('path');
var mimeType = require('../mime-types');
var compose = require('koa-compose');
var co = require('co');

module.exports = exports = function(file) {
    return function *(next) {
        var ctx = this;

        var docRoot  = ctx.conf.documentRoot;
        var pathname = ctx.request.pathname;

        var files;
        if (file instanceof Array) {
            files = file;
        }
        else if (typeof file == 'string') {
            files = [file];
        }

        var isExist = false;
        var dir = docRoot + pathname;
        if (file) {
            for (var i = 0; i < files.length; i++) {
                var filePath = dir + files[i];
                if (fs.existsSync(filePath)) {
                    var content = fs.readFileSync(filePath);
                    var extname = path.extname(filePath).slice(1);
                    ctx.body = content;
                    ctx.set('content-type', mimeType[extname] || mimeType.html);
                    isExist = true;
                    break;
                }
            }
        }

        if (!isExist) {
            if (ctx.conf.directoryIndexes
                && fs.existsSync(dir)
            ) {
                var listDirectory = require('./list-directory');
                var gen = compose([listDirectory(dir)]);
                var fn = co(gen);
                fn.call(ctx);
            }
            else {
                ctx.status = 404;
            }
        }

        yield next;
    }
};
